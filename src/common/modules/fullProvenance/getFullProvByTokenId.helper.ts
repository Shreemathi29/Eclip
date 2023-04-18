/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {MonarchaClient} from '@/clients/rest/monarcha.client';
import {GeocoderService} from '@/common/services/geocoder.service';
import {log, pretty} from '@/utils';
import {conditionalTitleCase, myTitleCase} from '@/utils/case';
import {HttpErrors} from '@loopback/rest';
import {
  Brand,
  IOrgType,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/brand/brand.model';
import {
  IItem,
  Item,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {
  IVariant,
  Variant,
} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import {mapLimit} from 'async';
import _ from 'lodash';
import moment, {Moment} from 'moment';
import {Batch, IBatch} from '../batch';
import {BatchLazyBindingParent} from '../batchLazyBindingParent/batchLazyBindingParent.model';
import {BrandMetaData} from '../brandMetaData/brandMetaData.model';
import {Campaign, CampaignStatus} from '../campaign/campaign.model';
import {CampaignMapping} from '../campaignMapping/campaignMapping.model';
import {CredTransaction, ICredTransaction} from '../credentialTransactions';
import {EntityRange} from '../entityRange/entityRange.model';
import {Fssai} from '../fssai/fssai.model';
import {MasterGtinHelper} from '../masterGtin/masterGtin.helper';
import {IPersona, Persona} from '../persona/persona.model';
import {
  IPersonaAltFieldMap,
  PersonaAltFieldMap,
} from '../personaAltFieldMap/personaAltFieldMap.model';
import {IProvenance, Provenance} from '../provenance';
import {ScanLog} from '../scanLog/scanLog.model';
import {ScanLogDetailed} from '../scanLogDetailed/scanLogDetailed.model';
import {ISDRPersonaTx, SDRPersonaTx} from '../sdrPersonaTx/sdrPersona.model';
import {SerializationGroup} from '../serializationGroup';
import {TemplateStyle} from '../templateStyle/templateStyle.model';
import {ProvSuggestionsCommonService} from './provSuggestions.common.service';
type TTStatus = 'tt-open' | 'tt-lock' | 'auth-open' | 'auth-lock';

export enum GtinQunatityMetric {
  volume = 'volume',
  weight = 'weight',
  dimensions = 'dimensions',
}

export class GetFullProvByTokenIdHelper {
  private filterInfo: {
    totalCredInProv?: number | undefined;
    totalcredsFetched?: number | undefined;
    allowedcreds?: number | undefined;
    finalcreds?: number | undefined;
  } = {};
  private variant: IVariant;
  private item: IItem;
  private templates: any;
  private batch?: IBatch | null | undefined;
  private provTxs?: ICredTransaction[];
  private provenance?: IProvenance | null | undefined;
  private provTranData?: any;
  private provenanceSuggestions?: any;
  private campaigns?: any;
  private persona: IPersona;
  private personaFieldMapping: IPersonaAltFieldMap | null;
  private qrSerialNo: string;
  private serializationGroupNo: string;
  private parentId: string;
  private org: any;
  private shortDate: string;
  private sdrPersonaTx: ISDRPersonaTx;
  private provResStrategy: string;
  private ageVerificationData: any;
  private campaignData?: any;
  private altFieldMap = {
    mappedCount: 0,
    isAltmapFound: false,
  };
  private masterGtinInst: MasterGtinHelper;
  private startTime: Moment;
  private order: number;
  constructor(
    private geoCoder: GeocoderService,
    private queryInput: {
      isHashGtin?: boolean;
      batch?: string;
      fssai?: string;
      // autoCorrectedRes?: any;
      mfgDate?: any;
      userProfile?: any;
      barcode?: string;
      nfcHash?: string;
      cakResponse?: any;
      location: any;
      scanLookupType: 'tokenId';
      appMode: 'web' | 'mobile';
      scanType: 'barcode' | 'nfc';
      userAgent: string;
      lat?: number;
      lon?: number;
      cakDecryptValues?: {
        serialNo: string;
        batchNo: string;
        // vcNo: string;
        orgNo: string;
        // netOpNo: string;
        parentId?: string;
        shortDate?: string;
      };
    },
    private reqIP: string,
    private provSuggestionsCommonService: ProvSuggestionsCommonService,
    private monarchaClient: MonarchaClient,
    private orgId: string,
    private env: any,
    private ageVerificationConfig?: any,
  ) {
    this.startTime = moment();

    this.parentId = queryInput.cakDecryptValues?.parentId as string;
    this.shortDate = queryInput.cakDecryptValues?.shortDate as string;
    const elements = queryInput.cakResponse?.decoded?.elements;
    this.serializationGroupNo = elements?.find(
      (x: any) => x.title === 'QR_BATCH',
    )?.value as string;
    this.qrSerialNo = elements?.find((x: any) => x.title === 'QR_SERIAL')
      ?.value as string;
  }

  public async get() {
    try {
      await this.getPersona();
      await this.getProvFetchOrder();
      log.info(`getFullProv v2InputData  ${pretty(this.queryInput)}`);
      log.info(
        `getFullProv ks1Decrypted  ${pretty(
          this.queryInput?.cakResponse?.decrypted,
        )}`,
      );
      log.info(`getFullProv location  ${pretty(this.queryInput?.location)}`);
      // -------------------------------

      // --------------------------------------------
      await this.getAgeVerificationData();
      await this.getOrg();
      await this.detectStrategyAndGetFromDB();
      await this.getProvTXs();
      await this.loadTemplates();
      await this.NoBlockaddCredTXtoCache();
      this.filterCredsByPersona();
      await this.getAltFieldMappingDocument();
      if (this.personaFieldMapping) {
        await this.doAltFiledMappingByPersona();
      }
      await this.getCampaigns();
      this.createScanLog({
        isSuccess: true,
        purpose: this.provenanceSuggestions ? 'sugg' : 'uniqScan',
      })
        .then(x => {
          log.info(`scanlog created successfully`);
        })
        .catch(err => {
          log.error(`error while creating scanlog ${err.message}`);
        });
      return {
        data: {
          persona: {
            name: this.queryInput?.userProfile?.givenName,
            email: this.queryInput?.userProfile?.email,
            personaName: this.persona?.name,
            sdrPersonaTx: this.sdrPersonaTx?._id,
            filterData: this.filterInfo,
            altFieldMap: this.altFieldMap,
          },
          others: this.ageVerificationData,
          product: this.formatProduct(),
          // productDetails: this.getProductDetails(),
          provenance: this.getAllProvStepData(),
          nestedProvenance: this.createdNestedProvTran(),
          provenanceProdCreds: this.getProvenanceProdCreds(),
          provenanceSuggestions: this.provenanceSuggestions,
          campaigns: this.campaigns,
          batch: this.getBatchData(),
          // campaign: this.campaignData,

          feedbackModal: this.getFeedback(),
          allProvStepMap: this.getAllMapData(),
        },
      };
    } catch (err) {
      this.createScanLog({isSuccess: false, purpose: 'error'})
        .then(x => {
          log.info(`scanlog created successfully`);
        })
        .catch(err => {
          log.error(`error while creating scanlog ${err.message}`);
        });
      throw err;
    }
  }

  private async getProvFetchOrder() {
    this.order = this.env?.PROV_FETCH_ORDER === 'ASC' ? 1 : -1;
  }

  private async getAgeVerificationData() {
    this.ageVerificationData = {
      isAgeVerReq: true,
      age_popup_details: await BrandMetaData.findOne({name: 'default'}),
    };
  }

  private async getOrg() {
    this.org = await Brand.findOne({orgType: IOrgType.NETWORK});
  }

  private async detectStrategyAndGetFromDB() {
    if (this.serializationGroupNo) {
      this.provResStrategy = 'EntityRange';
      await this.getFromDBforEntityRange();
    } else if (this.parentId) {
      this.provResStrategy = 'UniqueBatch';
      await this.getFromDBforUniqueBatch();
    } else if (this.queryInput.isHashGtin && this.queryInput.batch) {
      this.provResStrategy = 'GtinAndBatch';
      await this.getFromGtinAndBatch();
    } else if (this.queryInput.isHashGtin && !this.queryInput.batch) {
      this.provResStrategy = 'DefaultBatch';
      await this.getFromGtinAndDefaultBatch();
    } else {
      throw new HttpErrors.InternalServerError(
        `At getFullProv Unable to determine which lookup to use`,
      );
    }

    // --------------------------------------
    // --------------------------------------------------------
  }
  private async getFromGtinAndDefaultBatch() {
    log.info('fetch strategy => default batch');
    const gtinKey = this.queryInput.barcode;
    const variant = await Variant.findOne({gtinKey});
    if (!variant)
      throw new HttpErrors.NotFound(
        `getFromGtinAndDefaultBatch: variant not found: ${gtinKey}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    // ------------------------------------------------------------------
    // const org = await Organization.findOne({_id: product.org});
    // if (!org) throw new HttpErrors.NotFound(`org not found: ${product.org}`);
    // this.org = org;
    // ------------------------------------------------------------------
    const prodBatch = await Batch.findOne({
      name: 'Default',
      variants: variant._id,
    });
    this.batch = prodBatch as IBatch | null;
    // todo make prodBatch optional---------------------------------------------------------------------
    const provenance =
      prodBatch &&
      (
        await Provenance.aggregate([
          {
            $match: {
              batch: this.batch?._id,
              item: this.item._id,
            },
          },
          {$sort: {updatedAt: this.order}},
          {$limit: 1},
        ])
      )[0];
    this.provenance = provenance as IProvenance | null;
  }

  private async getCampaigns() {
    const campaignMapping = await CampaignMapping.find(
      {
        item: this.item?._id,
        variant: this.variant?._id,
        batch: this.batch?._id,
      },
      {campaignId: 1},
    );
    const campaignIds = campaignMapping.map(
      mappingObj => mappingObj?.campaignId,
    );
    this.campaigns = await Campaign.find({
      _id: {
        $in: campaignIds,
      },
      status: CampaignStatus.active,
    });
  }

  private async getFromGtinAndBatch() {
    log.info('fetch strategy => gtin and batch');

    const gtinKey = this.queryInput.barcode;
    const variant = await Variant.findOne({gtinKey});
    if (!variant)
      throw new HttpErrors.NotFound(
        `getFromGtinAndBatch: gtin not found: ${gtinKey}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;

    const fssaiData = await Fssai.findOne({fssaiCode: this.queryInput?.fssai});
    if (!fssaiData && !this.env?.FSSAI_OPTIONAL)
      throw new HttpErrors.NotFound(
        `fssai not found: ${this.queryInput?.fssai}`,
      );
    console.log(
      `FSSI code,fssai ${this.queryInput?.fssai}, plantCode ${fssaiData?.plantCode} =>`,
    );

    this.masterGtinInst = new MasterGtinHelper(
      {
        gtin: gtinKey as string,
        _batchName: this.queryInput.batch,
        _mfgDate: this.queryInput.mfgDate,
      },
      this.variant,
      this.item,
      this.provSuggestionsCommonService,
      this.order,
      fssaiData,
    );
    await this.masterGtinInst.generate();
    this.provenance = this.masterGtinInst.provenance;
    this.batch = this.masterGtinInst.prodBatch;
    this.provenanceSuggestions = this.masterGtinInst.provenanceSuggestions;
  }

  private async getFromDBforUniqueBatch() {
    log.info('fetch strategy => unique batch');
    const parentId = this.parentId;
    const shortDate = this.shortDate;
    const batchLazyBparent = await BatchLazyBindingParent.findOne({
      dateKey: shortDate,
      parentId,
    });
    if (!batchLazyBparent)
      throw new HttpErrors.NotFound(
        `batchLazyBparent not found: dateKey ${this.shortDate} ,parentId ${this.parentId} `,
      );

    const variant = await Variant.findOne({_id: batchLazyBparent?.variant});
    if (!variant)
      throw new HttpErrors.NotFound(
        `variant not found: ${batchLazyBparent?.variant}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    // ------------------------------------------------------------------
    // const org = await Organization.findOne({_id: product.org});
    // if (!org) throw new HttpErrors.NotFound(`org not found: ${product.org}`);
    // this.org = org;
    // ------------------------------------------------------------------
    const prodBatch = await Batch.findOne({_id: batchLazyBparent.batch});
    if (!prodBatch)
      throw new HttpErrors.NotFound(
        `prodBatch by Id ${batchLazyBparent.batch} not found`,
      );
    this.batch = prodBatch;
    //---------------------------------------------------------------------
    const provenance = (
      await Provenance.aggregate([
        {
          $match: {
            batch: this.batch?._id,
            item: this.item._id,
          },
        },
        {$sort: {updatedAt: this.order}},
        {$limit: 1},
      ])
    )[0];
    this.provenance = provenance;
    // ------------------------------------------------------------------------
  }
  private async getFromSerializedQRItem() {
    log.info('fetch strategy => default SerializedQRItem');
    const gtinKey = this.queryInput.barcode;
    const variant = await Variant.findOne({gtinKey});
    if (!variant)
      throw new HttpErrors.NotFound(
        `getFromGtinAndDefaultBatch: variant not found: ${gtinKey}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    // ------------------------------------------------------------------
    // const org = await Organization.findOne({_id: product.org});
    // if (!org) throw new HttpErrors.NotFound(`org not found: ${product.org}`);
    // this.org = org;
    // ------------------------------------------------------------------
    const prodBatch = await Batch.findOne({
      name: 'Default',
      variants: variant._id,
    });
    this.batch = prodBatch as IBatch | null;
    // todo make prodBatch optional---------------------------------------------------------------------

    const provenance =
      prodBatch &&
      (await Provenance.findOne({
        batch: this.batch?._id,
        item: this.item._id,
      }));
    this.provenance = provenance as IProvenance | null;
  }

  private async getFromDBforEntityRange() {
    log.info('fetch strategy => entity range');
    const serializationGroup = await SerializationGroup.findOne({
      batchNo: parseInt(this.serializationGroupNo),
    });

    if (!serializationGroup)
      throw new HttpErrors.NotFound(
        `serializationGroup not found: serializationGroupNo ${this.serializationGroupNo} ,qrSerialNo ${this.qrSerialNo} `,
      );
    const upperBound = {
      $gte: parseInt(this.qrSerialNo),
    };
    const lowerBound = {
      $lte: parseInt(this.qrSerialNo),
    };
    const entityRange = await EntityRange.findOne({
      serializationGroup: serializationGroup._id,
      upperBound,
      lowerBound,
    });
    if (!entityRange)
      throw new HttpErrors.NotFound(
        `entityRange not found: serializationGroupNo ${this.serializationGroupNo} ,qrSerialNo ${this.qrSerialNo} 	serializationGroup: ${serializationGroup._id}`,
      );
    const variant = await Variant.findOne({_id: entityRange?.variant});
    if (!variant)
      throw new HttpErrors.NotFound(
        `variant not found: ${entityRange?.variant}`,
      );
    this.variant = variant;
    // ----------------------------------------------------------------------
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    this.item = item;
    // ------------------------------------------------------------------
    // const org = await Organization.findOne({_id: product.org});
    // if (!org) throw new HttpErrors.NotFound(`org not found: ${product.org}`);
    // this.org = org;
    // ------------------------------------------------------------------
    const prodBatch = await Batch.findOne({_id: entityRange.batch});
    if (!prodBatch)
      throw new HttpErrors.NotFound(
        `prodBatch by Id ${entityRange.batch} not found`,
      );
    this.batch = prodBatch;
    //---------------------------------------------------------------------
    const provenance = (
      await Provenance.aggregate([
        {
          $match: {
            batch: this.batch?._id,
            item: this.item._id,
          },
        },
        {$sort: {updatedAt: this.order}},
        {$limit: 1},
      ])
    )[0];
    this.provenance = provenance;
    // ------------------------------------------------------------------------
  }

  private async getProvTXs() {
    const $in = this.provenance?.provSteps
      ?.map(x => {
        return [...(x.credTxs || []), x.parentCredTx || null];
      })
      .flat();
    if (_.isEmpty($in)) {
      this.provTxs = [];
    } else {
      const provTxs = await CredTransaction.find({_id: {$in}});
      this.provTxs = provTxs;
    }
    _.set(this.filterInfo, 'totalCredInProv', $in?.length);
  }

  private formatProduct() {
    return {
      images: this.item.assets?.imgs?.map(x => x.src).filter(x => !!x),
      videos: this.item.assets?.videos,
      title: this.item.name,
      subtitle: this.item?.desc?.[0]?.val,
      qtyKey: this.getQtyFormatted(
        this.getAttribute(this.item, 'quantityMetric'),
      ),
      qtyValue: this.getAttribute(this.variant, 'quantity'),
      priceKey: 'Price',
      priceValue: this.getAttribute(this.variant, 'price'),
      serialKey: (this.qrSerialNo && 'Serial No.') || undefined,
      serialValue: this.qrSerialNo || undefined,
      // serialKey: undefined,
      // serialValue: undefined,

      authenticityFlag: this.getTTStatus(),
      isCampaignPresent: !_.isEmpty(this.campaignData ?? false),
      // webUrl: this.org.website,
      batch: this.batch?.name,
      logo: this.org.logo,
      gtin: this.variant?.gtinKey,
      mfgDate:
        this.batch?.manufactureDate &&
        moment(this.batch?.manufactureDate).format('DD-MM-YYYY'),
    };
  }

  // private rmEmptyValues(arr: {label?: string; value?: string; key?: string}[]) {
  // 	return arr.filter(x => !_.isNil(x.value));
  // }

  private getQtyFormatted(val?: GtinQunatityMetric | string) {
    switch (val) {
      case GtinQunatityMetric.volume:
        return 'Vol.';
      case GtinQunatityMetric.weight:
        return 'Weight';
      case GtinQunatityMetric.dimensions:
        return 'Dimensions';

      default:
        return 'quantity';
    }
  }

  private getFeedback() {
    return {
      title: 'feedback',
      prodImage: {
        uri: this.item.assets?.imgs?.map(x => x.src).filter(x => !!x)?.[0],
      },
      prodTitle: this.item.name,
      prodSubTitle: this.item?.desc?.[1]?.val,
      prodPrice: this.getAttribute(this.variant, 'price'),
    };
  }

  private filterCredsByPersona() {
    const personaCredTemps = this.sdrPersonaTx.claims.map(x =>
      x.credentialTemplate?.toString(),
    );
    const newProvTxs = this.provTxs?.filter(x => {
      return personaCredTemps.includes(x.credentialTemplate?.toString());
    });
    const totalcredsFetched = this.provTxs?.length;
    this.provTxs = newProvTxs || [];

    this.filterInfo = {
      ...(this.filterInfo || {}),
      totalcredsFetched,
      allowedcreds: this.sdrPersonaTx?.claims?.length,
      finalcreds: newProvTxs?.length,
    };
  }

  private getBatchData() {
    return _.pick(this.batch, [
      'promoButtonText1',
      'promoButtonText2',
      'promoVideoUrl',
      'promoWebsiteUrl',
      'name',
      '_id',
    ]);
  }

  private async loadTemplates() {
    const credTemps = this.provTxs?.map(provTx => provTx.credentialTemplate);

    const templatesStyleData = await TemplateStyle.find(
      {
        _id: {
          $in: credTemps,
        },
      },
      {iconURL: 1},
    );
    this.templates = templatesStyleData;
  }

  private getIconURL(templateId: any) {
    let iconURL = '';
    for (let i = 0; i < this.templates.length; i++) {
      if (templateId.equals(this.templates[i]._id)) {
        iconURL = this.templates[i].iconURL;
        break;
      } else {
        continue;
      }
    }
    return iconURL;
  }

  private getAllProvStepData() {
    // const provSteps = this.provenance?.provSteps(this.provenance?.provSteps ||[])
    const data = this.provenance?.provSteps?.map(step => {
      const credTxs = [step.parentCredTx, ...(step?.credTxs || [])];

      const substeps = credTxs?.map(credTxId => {
        const credTx = this.provTxs?.find(
          x => x._id.toString() === credTxId.toString(),
        );
        if (!credTx) return null;
        const credSub = credTx?.credentialContent?.credentialSubject;
        return {
          tag:
            (credTx?.credentialContent as any)?.tag || credSub?.credentialName,
          title: conditionalTitleCase(credSub?.credentialName || 'info'),
          description: credSub?.description,
          subtitle: credSub?.subtitle || credSub?.description,
          grDate: credSub?.grDate,
          date:
            credSub?.date && moment.isDate(credSub.date)
              ? moment(credSub.date).format('DD mmm YYY')
              : credSub.date,
          gtinKey: this.variant.gtinKey,
          credTxId: credTx._id,
          iconURL: this.getIconURL(credTx.credentialTemplate),
        };
      });
      return {
        title: step.title ?? 'info',
        subtitle: step.subtitle ?? 'info',
        data: substeps?.filter(x => !!x) || [],
        parentCredTranId: step.parentCredTx,
      };
    });
    this.provTranData = data?.filter(x => !_.isEmpty(x.data)) ?? [];
    return {
      data: this.provTranData,
      _id: this.provenance?._id,
      name: this.provenance?.name,
    };
  }

  private createdNestedProvTran() {
    const parentTranObj: any = {};
    const finalCredTranArr: any[] = [];
    let duplicateParents: any[] = [];
    // collect parent trxn ids
    const parentTrans = this.provTranData?.map(
      (provTran: {parentCredTranId: any}) => {
        parentTranObj[provTran.parentCredTranId] = provTran;
        return provTran?.parentCredTranId;
      },
    );
    let parentIds: any = [];
    const data = this.provTranData?.map((step: any) => {
      // process step child tran
      const nestedStep = step?.data?.map((substep: any) => {
        let childIds = [];
        if (
          parentTrans.includes(substep.credTxId) &&
          !duplicateParents.includes(substep.credTxId.toString())
        ) {
          parentIds.push(parentTranObj[substep.credTxId.toString()]['title']);
          const subStepChildrens =
            parentTranObj[substep.credTxId.toString()]['data'];
          childIds = subStepChildrens.map(
            (child: {credTxId: any}) => child.credTxId,
          );
          duplicateParents.push(substep.credTxId.toString());
        }
        return {
          tag: substep?.tag,
          title: substep?.title,
          description: substep.description,
          subtitle: substep.subtitle,
          date: substep.date,
          gtinKey: substep.gtinKey,
          grDate: substep.grDate,
          credTxId: substep.credTxId,
          childId: childIds,
          level: step.title == 'FG' ? '0' : step.title,
        };
      });
      // push data into final arr
      // map not used here because every time it returns new arr and we need all objects into one array
      for (let i = 0; i < nestedStep.length; i++) {
        finalCredTranArr.push(nestedStep[i]);
      }
    });
    return {
      data: finalCredTranArr,
      _id: this.provenance?._id,
      name: this.provenance?.name,
    };
  }

  private getProvenanceProdCreds() {
    const parentTranObj: any = {};
    const finalCredTranArr: any[] = [];
    // collect parent trxn ids
    const parentTrans = this.provTranData?.map(
      (provTran: {parentCredTranId: any}) => {
        parentTranObj[provTran.parentCredTranId] = provTran;
        return provTran?.parentCredTranId.toString();
      },
    );
    const data = this.provTranData?.map((step: any) => {
      // process step child tran
      const nestedStep = step?.data?.map((substep: any) => {
        let childIds = [];
        let filteredChildIds = [];
        if (
          parentTrans.includes(substep.credTxId.toString()) &&
          step.parentCredTranId.toString() !== substep.credTxId.toString()
        ) {
          const subStepChildrens =
            parentTranObj[substep.credTxId.toString()]['data'];
          childIds = subStepChildrens.map((child: {credTxId: any}) => {
            if (child.credTxId.toString() !== substep.credTxId.toString()) {
              return child.credTxId;
            }
          });
          filteredChildIds = childIds.filter(function (id: null) {
            return id != null;
          });
        }
        return {
          parentCredTxId: step?.parentCredTranId,
          credTxId: substep.credTxId,
          childId: filteredChildIds,
          level: step.title == 'FG' ? '0' : step.title,
        };
      });
      // push data into final arr
      // map not used here because every time it returns new arr and we need all objects into one array
      for (let i = 0; i < nestedStep.length; i++) {
        finalCredTranArr.push(nestedStep[i]);
      }
    });
    return {
      data: finalCredTranArr,
      _id: this.provenance?._id,
      name: this.provenance?.name,
    };
  }

  private getAllMapData() {
    const _credTxsIds = this.provenance?.provSteps
      ?.map(x => {
        return [...(x.credTxs || []), x.parentCredTx || null];
      })
      .flat()
      .filter(x => !!x)
      .map(x => x.toString());

    const credTxsIds = _.uniq(_credTxsIds);
    const data = credTxsIds?.map(id => {
      const credTx = this.provTxs?.find(
        y => y._id.toString() === id.toString(),
      );
      if (!credTx) return null;
      const logo = credTx.credentialContent?.credentialSubject?.logo;
      const image = Array.isArray(logo) ? logo?.[0] : logo;
      return {
        image,
        title: myTitleCase(
          credTx.credentialContent?.credentialSubject?.credentialName || '',
        ),
        location: {
          geojson: credTx.credentialContent?.geoJSON || null,
        },
        gtinKey: this.variant.gtinKey,
        credTxId: credTx._id,
      };
    });
    return {
      allProvStepMapCardList: {
        allProvStepMapCardList: data.filter(x => !!x) || [],
      },
    };
  }
  private getTTStatus(): TTStatus | null {
    if (!this.queryInput?.nfcHash) return null;
    const isTampered = this.queryInput?.cakResponse?.decrypted?.isTampered;
    const isTamperTag = this.queryInput?.cakResponse?.decrypted?.isTamperTag;
    if (isTamperTag && isTampered) return 'tt-open';
    if (isTamperTag && !isTampered) return 'tt-lock';
    if (!isTamperTag && isTampered) return 'auth-open';
    return 'auth-lock';
  }
  private async createScanLog({
    isSuccess,
    purpose,
  }: {
    isSuccess: boolean;
    purpose: string;
  }) {
    const uid = this.queryInput?.nfcHash?.split('?uid=')?.[1]?.split('x')?.[0];
    //  -----------------------------------------------------------------
    const {location} = await this.geoCoder.getLocationFromIPorGeoCoordts({
      latitude: this.queryInput.lat,
      longitude: this.queryInput.lon,
      ip: this.reqIP,
    });
    const tapCountString = this.queryInput?.cakResponse?.decrypted?.tapCount;
    let tapCount: undefined | number = undefined;
    try {
      tapCount = parseInt(tapCountString as string);
      if (_.isNaN(tapCount) || !_.isNumber) tapCount = undefined;
    } catch {
      //
    }
    const ret = await ScanLog.create({
      mfgDate: this.queryInput?.mfgDate,
      tokenId: this.queryInput.cakDecryptValues?.serialNo,
      tokenGroup: this.serializationGroupNo,
      scanLookupType: this.queryInput.scanLookupType,
      appMode: this.queryInput.appMode,
      scanType: this.queryInput.scanType,
      scannedHash: this.queryInput?.barcode ?? this.queryInput?.nfcHash ?? '',
      status: 200,
      ip: this.reqIP,
      location,
      batchNo: this.batch?.name,
      gtinkey: this.variant?.gtinKey,
      who: this.queryInput?.userProfile?.email || '',
      isTampered: !!this.queryInput?.cakResponse?.decrypted?.isTampered,
      tapCount: tapCount as number,
      uid,
      isTamperTag: this.queryInput?.cakResponse?.decrypted
        ?.isTamperTag as boolean,
      productName: this.item?.name,
      fssai: this.queryInput?.fssai,
      gtin: this.variant?._id,
      batch: this.batch?._id,
      product: this.item?._id,
      isSuccess,
      purpose,
      isShelfLifeExceeded: this.getIsShelfLifeExceeded(),
      cakDecryptValues: this.queryInput?.cakDecryptValues,
      prov: this.provenance?._id,
      duration: moment().diff(this.startTime, 'milliseconds'),
      strategy: this.provResStrategy,
      personaInfo: {
        personaName: this.persona?.name,
        sdrPersonaTx: this.sdrPersonaTx?._id,
        filterData: this.filterInfo,
        altFieldMap: this.altFieldMap,
      },
    });
    const {
      masterGtinMap,
      masterItem,
      masterVariant,
      provsAggRes,
      provenanceSuggestions,
      provSuggInst,
      sanitizedInput,
      _autoCorrectedInput,
      originalItem,
      originalVariant,
    } = this.masterGtinInst || {};
    await ScanLogDetailed.create({
      scanLog: ret._id,
      data: {
        masterGtinKey: masterGtinMap?.masterGtin,
        masterItemId: masterItem?._id,
        masterVariantId: masterVariant?._id,
        provsAggRes: provsAggRes,
        provenanceSuggestions: JSON.stringify(provenanceSuggestions),
        batchProvAgg: provSuggInst?.batchProvAgg,
        mfgProvAgg: provSuggInst?.mfgProvAgg,
        sanitizedInput: sanitizedInput,
        autoCorrectedInput: _autoCorrectedInput,
        originalItemId: originalItem?._id,
        originalVariantId: originalVariant?._id,
        originalVariantGtinKey: originalVariant?.gtinKey,
        queryInput: this.queryInput,
      },
    });
  }

  getIsShelfLifeExceeded() {
    if (this.batch?.shelfLife && this.batch?.manufactureDate)
      return (
        moment().isAfter(moment(this.batch.shelfLife)) ||
        moment().isBefore(moment(this.batch.manufactureDate))
      );

    if (this.batch?.shelfLife && !this.batch?.manufactureDate)
      return moment().isAfter(moment(this.batch.shelfLife));

    if (!this.batch?.shelfLife && this.batch?.manufactureDate)
      return moment().isBefore(moment(this.batch.manufactureDate));
    return false;
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

  async getAltFieldMappingDocument() {
    let personaFieldMapping: IPersonaAltFieldMap | null = null;
    if (this.persona._id) {
      personaFieldMapping = await PersonaAltFieldMap.findOne({
        persona: this.persona._id,
        items: this.item._id,
      });
    }
    this.personaFieldMapping = personaFieldMapping;
  }

  async doAltFiledMappingByPersona() {
    // let provTxsArr = this.provTxs || [];
    const stageDataArr = this.personaFieldMapping?.stageData || [];
    // for (let i = 0; i < provTxsArr.length; i++) {
    //   for (let j = 0; j < stageDataArr.length; j++) {
    //     const credName =
    //       provTxsArr[i].credentialContent.credentialSubject.credentialName;
    //     // ------------------------------------
    //     if (credName.toLowerCase() === stageDataArr[j].keyName.toLowerCase()) {
    //       provTxsArr[i].credentialContent.credentialSubject.credentialName =
    //         stageDataArr[j].displayName;
    //     }
    //     // -----------------------------
    //     if (['fg', 'finishedgood'].includes(credName.toLowerCase())) {
    //       provTxsArr[i].credentialContent.credentialSubject.credentialName =
    //         this.item.name;
    //     }
    //   }
    // }
    this.altFieldMap.isAltmapFound = true;
    const altProvTxs = this.provTxs?.map(x => {
      const altMap = stageDataArr.find(
        y =>
          y.keyName?.toLowerCase() ===
          x.credentialContent?.credentialSubject?.credentialName?.toLowerCase(),
      );
      if (altMap) {
        (x.credentialContent as any).tag =
          x.credentialContent.credentialSubject.credentialName;
        x.credentialContent.credentialSubject.credentialName =
          altMap.displayName;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
        return x;
      }
      if (
        ['fg', 'finishedgood'].includes(
          x.credentialContent?.credentialSubject?.credentialName.toLowerCase(),
        )
      ) {
        (x.credentialContent as any).tag =
          x.credentialContent.credentialSubject.credentialName;
        x.credentialContent.credentialSubject.credentialName = this.item.name;
        this.altFieldMap.mappedCount = this.altFieldMap.mappedCount + 1;
        return x;
      }
      return x;
    });
    this.provTxs = altProvTxs;
  }

  private getAttribute(val: IItem | IVariant, key: string) {
    return val?.attrs?.find(x => x.name === key)?.val;
  }

  private async _addCredTXtoCache() {
    if (!this.provenance) return;
    const allKlefkiIds =
      this.provTxs?.map(x => x.klefki_id)?.filter(x => !!x) || [];
    const externalId = this.orgId;
    const result = await mapLimit(allKlefkiIds, 2, async (klefkiId: string) => {
      return this.monarchaClient.verifyCredential({
        externalId,
        id: klefkiId,
      });
    });
    return result;
  }
  private async NoBlockaddCredTXtoCache() {
    this._addCredTXtoCache()
      .then(results => {
        log.info(
          `cache: ${results?.length} items might be added to cache. provId: ${this.provenance?._id}`,
        );
      })
      .catch(err => {
        log.warn(`error during addCredTXtoCache ${err.message}`);
        console.log('addCredTXtoCache => err', err);
      });
  }
}
