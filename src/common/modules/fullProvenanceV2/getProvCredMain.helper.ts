/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient, VCredential} from '@/clients/rest/monarcha.client';
import {EnvModule, log, pretty} from '@/utils';
import {conditionalTitleCase, myTitleCase} from '@/utils/case';
import {HttpErrors} from '@loopback/rest';
import {IItem} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {IVariant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import _ from 'lodash';
import {CredentialConfig} from '../credential';
import {ICredTransaction} from '../credentialTransactions/credentialTransaction.model';
import {IPersona} from '../persona/persona.model';
import {IPersonaAltFieldMap} from '../personaAltFieldMap/personaAltFieldMap.model';
import {ISDRPersonaTx} from '../sdrPersonaTx/sdrPersona.model';
import {ITemplateStyle} from '../templateStyle/templateStyle.model';
const env = EnvModule?.getInstance()?.getEnv();

export class GetProvCredMainHelper {
  private credTemplate?: ITemplateStyle | null;
  private credSub?: {[key: string]: string | string[]};
  private evidence?: any | null;
  private altFieldMap = {
    mappedCount: 0,
    isAltmapFound: false,
  };
  constructor(
    private queryInput: {
      userProfile?: any;
    },
    private credTx: ICredTransaction | null,
    private sdrPersonaTx: ISDRPersonaTx,
    private persona: IPersona,
    private personaFieldMapping: IPersonaAltFieldMap | null,
    private item: IItem | null,
    private variant: IVariant | null,
    private credTemplates: ITemplateStyle[] | null,
    private defaultCredTemplate: ITemplateStyle | null,
    private org: any,
    private env: any,
    private monarchaClient: MonarchaClient,
    private credentialConfig: CredentialConfig,
  ) {}

  public async get() {
    log.info(`get Prov ==> ${pretty(this.queryInput)}`);
    //  -----------------------------------------------------------------------
    await this.decodeCred();
    this.filterKeys();
    if (this.personaFieldMapping) {
      await this.doAltFiledMappingByPersona();
    }
    await this.loadTemplateData();
    await this.removeEmptyValues();
    await this.alterCredSubKeys();
    await this.removeNonZeroValues();
    //  ---------------------------------------------------------------------------
    const response: any = {
      persona: {
        name: this.queryInput?.userProfile?.givenName,
        email: this.queryInput?.userProfile?.email,
        personaName: this.persona?.name,
        sdrPersonaTx: this.sdrPersonaTx?._id,
        altFieldMap: this.altFieldMap,
      },
      organization: this.org?.name,
      organizationLogo: this.org?.logo,
      iconURL: this.credTemplate?.iconURL,
      credTxId: this.credTx?._id,
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
    };
    if (env?.VERIFY_CRDENTIAL_CONFIG?.isEnabled) {
      response.credentialURL =
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

  private async decodeCred() {
    try {
      if (this.env?.GET_DECODED_INFO_FROM_MONARCHA) {
        const decodedCred = (await this.monarchaClient.verifyCredential({
          externalId: this.credentialConfig.externalId,
          id: this.credTx?.klefki_id as string,
        })) as VCredential;
        this.credSub = decodedCred?.credentialSubject;
        this.evidence = decodedCred?.evidence;
      } else {
        this.credSub = {
          ...(this.credTx?.credentialContent?.credentialSubject || {}),
        };
        this.evidence = this.credTx?.credentialContent?.evidences; //*
      }
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
    if (Array.isArray(evi) && !_.isEmpty(evi)) {
      evi.forEach(x => {
        chipItems.push({
          key: (this.getTitle() || this.credSub?.credentialName) ?? '',
          imageUri: this.getSingleLogo(this.credSub?.logo) ?? '',
          title: this.getTitle(),
          docUri: x,
        });
      });
    } else if (!Array.isArray(evi)) {
      chipItems.push({
        key: (this.getTitle() || this.credSub?.credentialName) ?? '',
        imageUri: this.getSingleLogo(this.credSub?.logo) ?? '',
        title: this.getTitle(),
        docUri: evi,
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
    const credTemplate: any = this.credTemplates?.filter(credTemp =>
      credTemp?._id.equals(this.credTx?.credentialTemplate),
    );
    this.credTemplate = credTemplate[0];
    // default - load others if template not found
    if (!this.credTemplate) {
      this.credTemplate = this.defaultCredTemplate;
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

  private filterKeys() {
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
        this.credSub.credentialName = altMap.displayName;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
      }
      if (
        ['fg', 'finishedgood'].includes(
          (this.credSub?.credentialName as string)?.toLowerCase(),
        )
      ) {
        this.credSub.credentialName = this.item?.name as string;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
      }
    }
  }
}
