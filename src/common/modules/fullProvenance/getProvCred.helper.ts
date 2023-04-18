/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {EnvModule, log, pretty} from '@/utils';
import {conditionalTitleCase, myTitleCase} from '@/utils/case';
import {HttpErrors} from '@loopback/rest';
import {
  IItem,
  Item,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {
  IVariant,
  Variant,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _ from 'lodash';
import {CredentialConfig} from '../credential';
import {CredTransaction, ICredTransaction} from '../credentialTransactions';
import {IPersona, Persona} from '../persona/persona.model';
import {
  IPersonaAltFieldMap,
  PersonaAltFieldMap,
} from '../personaAltFieldMap/personaAltFieldMap.model';
import {ISDRPersonaTx, SDRPersonaTx} from '../sdrPersonaTx/sdrPersona.model';
import {
  ITemplateStyle,
  TemplateStyle,
} from '../templateStyle/templateStyle.model';
const env = EnvModule?.getInstance()?.getEnv();

export class GetProvCredHelper {
  private credTx?: ICredTransaction | null;
  private credTemplate?: ITemplateStyle | null;
  private credSub?: {[key: string]: string | string[]};
  private evidence?: any | null;
  // private decodedCred: VCredential;
  private sdrPersonaTx: ISDRPersonaTx;
  private persona: IPersona;
  private personaFieldMapping: IPersonaAltFieldMap | null;
  private item: IItem | null;
  private variant: IVariant | null;
  private altFieldMap = {
    mappedCount: 0,
    isAltmapFound: false,
  };
  constructor(
    private queryInput: {
      gtin: string;
      credTxId: string;
      userProfile?: any;
    },
    private monarchaClient: MonarchaClient,
    private credentialConfig: CredentialConfig,
  ) {}

  public async get() {
    log.info(`get Prov ==> ${pretty(this.queryInput)}`);
    //  -----------------------------------------------------------------------
    await this.getFromDB();
    await this.decodeCred();
    await this.getPersona();
    this.filterKeys();
    await this.getAltFieldMappingDocument();
    if (this.personaFieldMapping) {
      await this.doAltFiledMappingByPersona();
    }
    await this.loadTemplateData();
    await this.removeEmptyValues();
    await this.alterCredSubKeys();
    await this.removeNonZeroValues();
    //  ---------------------------------------------------------------------------
    const response: any = {
      data: {
        persona: {
          // user: this.queryInput?.userProfile?.email,
          // personaName: this.persona?.name,
          name: this.queryInput?.userProfile?.givenName,
          email: this.queryInput?.userProfile?.email,
          personaName: this.persona?.name,
          sdrPersonaTx: this.sdrPersonaTx?._id,
          altFieldMap: this.altFieldMap,
        },
        ProvStepTitle: {
          title: this.credSub?.description ?? '',
          _id: this.sdrPersonaTx?._id,
        },
        ProvStepImages: this.getProvStepImages(),
        ProvStepTitleCard: {
          title: this.credSub?.description ?? '',
          extraInfo: [],
        },
        ChipList: this.getChipList(),
        ProvDetailInfo: this.getProvDetailInfo(),
        provMapProps: {geojson: this.getGeoJson()},
        // allProvStepMap: this.getAllProvStepData(),
      },
    };
    if (env?.VERIFY_CRDENTIAL_CONFIG?.isEnabled) {
      response.data.credentialURL =
        env?.VERIFY_CRDENTIAL_CONFIG?.verifyWebAppUrl +
        '/' +
        this.credentialConfig.externalId +
        '/' +
        this.credTx?.klefki_id;
    }
    return response;
  }

  private getGeoJson() {
    try {
      if (!this.credSub?.geoJSON || !_.isString(this.credSub?.geoJSON))
        return null;
      return JSON.parse(this.credSub?.geoJSON);
    } catch (err) {
      log.warn(`issue parsing geoJson for credTx: ${this.credTx?.id}`);
      return null;
    }
  }
  private async getFromDB() {
    // ---------------------------------------------------------------------
    const credTx = await CredTransaction.findOne({
      _id: this.queryInput?.credTxId,
    });

    if (!credTx)
      throw new HttpErrors.NotFound(
        `credTx for Id: ${this.queryInput?.credTxId} not found`,
      );

    this.credTx = credTx;

    // ------------------------------------------------------------------------
  }

  private async decodeCred() {
    try {
      const decodedCred = (await this.monarchaClient.verifyCredential({
        externalId: this.credentialConfig.externalId,
        id: this.credTx?.klefki_id as string,
      })) as VCredential;
      // this.decodedCred = decodedCred;
      this.credSub = decodedCred?.credentialSubject;
      this.evidence = decodedCred?.evidence;
    } catch (err) {
      this.credSub = {
        ...(this.credTx?.credentialContent?.credentialSubject || {}),
      };
      this.evidence = this.credTx?.credentialContent?.evidences; //*
    }
  }

  private getProvDetailInfo() {
    const newCredSub = _.omit(this.credSub ?? {}, [
      'logo',
      'credentialName',
      'geoJSON',
      'did',
      'id',
      'alias',
      'description',
      'subtitle',
    ]);
    const newCredSubArray = Object.entries(newCredSub || {});
    return {
      tag: this.credTx?.credentialContent?.credentialSubject?.credentialName,
      title: conditionalTitleCase(this.credSub?.credentialName as string) || '',
      subtitle: (this.credSub?.subtitle as string) || '',
      aboutProvInfo: this.credSub?.description ?? '',
      provInfoList: newCredSubArray
        .map(x => ({label: myTitleCase(x[0]), value: x[1]}))
        .filter(x => _.isString(x.value)),
    };
  }
  private getChipList() {
    const chipItems: object[] = [];
    const evi = this.evidence;
    // console.log('evi', evi);
    if (Array.isArray(evi) && !_.isEmpty(evi)) {
      evi.forEach(x => {
        chipItems.push({
          key: (this.getTitle() || this.credSub?.credentialName) ?? '',
          imageUri: this.getSingleLogo(this.credSub?.logo) ?? '',
          title: this.getTitle(),
          docUri: x?.id,
        });
      });
    } else if (!Array.isArray(evi)) {
      chipItems.push({
        key: (this.getTitle() || this.credSub?.credentialName) ?? '',
        imageUri: this.getSingleLogo(this.credSub?.logo) ?? '',
        title: this.getTitle(),
        docUri: evi?.id,
      });
    }
    return {
      rightIconName: 'attachment',
      rightIconType: 'entypo',
      rightIconColor: '#000',
      rightIconSize: 20,
      chipItems,
    };
  }

  private getProvStepImages() {
    const images: {image: string}[] = [];
    if (_.isString(this.credTx?.credentialContent?.images))
      images.push({image: this.credTx?.credentialContent?.images as string});
    if (Array.isArray(this.credTx?.credentialContent?.images)) {
      this.credTx?.credentialContent?.images.forEach(x => {
        images.push({image: x});
      });
    }
    return {
      provImages: images,
    };
  }

  private getTitle() {
    return myTitleCase((this.credSub?.credentialName as string) || '');
  }

  private getSingleLogo(logo?: string | string[]) {
    if (Array.isArray(logo)) return logo[0];
    return logo;
  }

  private async loadTemplateData() {
    // load credential template in memory
    this.credTemplate = await TemplateStyle.findOne({
      _id: this.credTx?.credentialTemplate,
    });
    // default - load others if template not found
    if (!this.credTemplate) {
      this.credTemplate = await TemplateStyle.findOne({name: 'Others'});
    }
  }

  private async alterCredSubKeys() {
    // alter perctVolPerVol to %v/v
    if (this.credSub && 'perctVolPerVol' in this.credSub) {
      this.credSub['Percent Vol.'] = this.credSub?.perctVolPerVol;
      delete this.credSub?.perctVolPerVol;
    }
  }

  private async removeNonZeroValues() {
    // remove zero values
    const allowedNonZeros: any = [0, '0', 0.0, '0.0'];
    for (const item in this.credSub) {
      if (
        allowedNonZeros.includes(this.credSub[item]) &&
        this.credTemplate?.zeroFields?.includes(item)
      ) {
        delete this.credSub[item];
      }
    }
  }

  private async removeEmptyValues() {
    for (const item in this.credSub) {
      if (this.credSub[item] === '' || this.credSub[item] === null) {
        delete this.credSub[item];
      }
    }
  }

  async getPersona() {
    const email = this.queryInput?.userProfile?.user?.email;
    let persona: IPersona | null = null;
    if (email) {
      persona = await Persona.findOne({'users.email': email});
    }
    if (!persona) {
      persona = await Persona.findOne({name: 'Customer'});
    }
    if (!persona)
      throw new HttpErrors.NotFound(`no persona found email: ${email}`);
    const sdrPersonaTx = await SDRPersonaTx.findOne({
      _id: persona.sdrPersonaTx,
    });
    if (!sdrPersonaTx)
      throw new HttpErrors.NotFound(
        `sdrPersonaTx not found  for email: ${email}`,
      );
    // return {persona, sdrPersonaTx};
    this.sdrPersonaTx = sdrPersonaTx;
    this.persona = persona;
  }

  private filterKeys() {
    // const sdrPersonaCredTemps = this.sdrPersonaTx.claims?.map(x =>
    // 	x.credentialTemplate?.toHexString(),
    // );
    const credTemp = this.sdrPersonaTx.claims?.find(
      x =>
        x.credentialTemplate?.toString() ===
        this.credTx?.credentialTemplate?.toString(),
    );
    if (!credTemp)
      throw new HttpErrors.Forbidden(
        `not authorized to view credential ${this.credTx?.credentialTemplate} email: ${this.queryInput?.userProfile?.email}`,
      );

    if (credTemp.allKeysEnabled) {
      // temp = this.credSub
    } else {
      const temp = _.pick(this.credSub, [
        'credentialName',
        'description',
        'logo',
        ...(credTemp?.allowedKeys || []),
      ]);
      const newCredSub = _.pickBy(temp, _.identity);
      this.credSub = (newCredSub as {[key: string]: string | string[]}) || {};
      if (!credTemp?.allowedKeys?.includes('evidence')) this.evidence = null;
    }
  }
  async getAltFieldMappingDocument() {
    const variant = await Variant.findOne({gtinKey: this.queryInput?.gtin});
    if (!variant)
      throw new HttpErrors.NotFound(
        `variant not found: gtinKey : ${this.queryInput?.gtin}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    let personaFieldMapping: IPersonaAltFieldMap | null = null;
    if (this.persona._id) {
      personaFieldMapping = await PersonaAltFieldMap.findOne({
        persona: this.persona._id,
        items: this.item?._id,
      });
    }
    this.personaFieldMapping = personaFieldMapping;
  }

  async doAltFiledMappingByPersona() {
    const stageDataArr = this.personaFieldMapping?.stageData || [];
    this.altFieldMap.isAltmapFound = true;
    if (this.credSub) {
      const altMap = stageDataArr.find(
        y =>
          y.keyName?.toLowerCase() ===
          (this.credSub?.credentialName as string)?.toLowerCase(),
      );
      if (altMap) {
        // (this.credTx.credentialContent as any).tag =
        //   this.credSub.credentialName;
        this.credSub.credentialName = altMap.displayName;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
      }
      if (
        ['fg', 'finishedgood'].includes(
          (this.credSub?.credentialName as string)?.toLowerCase(),
        )
      ) {
        // (this.credTx.credentialContent as any).tag =
        //   this.credSub.credentialName;
        this.credSub.credentialName = this.item?.name as string;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
      }
    }

    // this.provTxs?.map(x => {
    //   const altMap = stageDataArr.find(
    //     y =>
    //       y.keyName?.toLowerCase() ===
    //       x.credentialContent?.credentialSubject?.credentialName?.toLowerCase(),
    //   );
    //   if (altMap) {
    //     (x.credentialContent as any).tag =
    //       x.credentialContent.credentialSubject.credentialName;
    //     x.credentialContent.credentialSubject.credentialName =
    //       altMap.displayName;
    //     this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
    //     return x;
    //   }
    //   if (
    //     ['fg', 'finishedgood'].includes(
    //       x.credentialContent?.credentialSubject?.credentialName.toLowerCase(),
    //     )
    //   ) {
    //     (x.credentialContent as any).tag =
    //       x.credentialContent.credentialSubject.credentialName;
    //     x.credentialContent.credentialSubject.credentialName = this.item.name;
    //     this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
    //     return x;
    //   }
    //   return x;
    // });
    // this.provTxs = altProvTxs;
  }

  // private async getMyPersona() {
  // 	const email = this.metadata?.user?.email;
  // 	const personas = await Persona.find({
  // 		$or: [{name: 'Public'}, {'users.email': email}],
  // 	});
  // 	const persona = personas.find(x=>x.)
  // }
}
