/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils';
import {bind, BindingScope} from '@loopback/core';
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
import {Batch, IBatch} from '../batch';
import {IFssai} from '../fssai/fssai.model';
import {ProvSuggestionsCommonService} from '../fullProvenance/provSuggestions.common.service';
import {ProvSuggestionsHelper} from '../fullProvenance/provSuggestions.helper';
import {IProvenance, Provenance} from '../provenance';
// import {logStage} from '../provenance/issueManyProvCred.utils';
import {IMasterGtinMap, MasterGtinMap} from './materGtinMap.model';

type BatchAndMfg = {
  batchName: string | null | undefined;
  mfgDate: string | null | undefined;
};
@bind({scope: BindingScope.SINGLETON})
export class MasterGtinHelper {
  public masterGtinMap: IMasterGtinMap | null = null;
  public masterVariant: IVariant | null;
  public masterItem: IItem | null;
  public prodBatch: IBatch | null;
  public _autoCorrectedInput: BatchAndMfg;
  public sanitizedInput: BatchAndMfg;
  public provenance: IProvenance | null;
  public provsAggRes: any[];
  public provenanceSuggestions: any;
  public provSuggInst: ProvSuggestionsHelper;
  constructor(
    public miscInput: {
      gtin: string;
      _batchName: string | undefined;
      _mfgDate: string | undefined;
    },
    public originalVariant: IVariant,
    public originalItem: IItem,
    private provSuggCommonService: ProvSuggestionsCommonService,
    private order: number,
    public fssai?: IFssai | undefined | null,
  ) {}

  public async generate() {
    await this.getMasterGtinMap();
    await this.getMasterVariantAndItem();

    await this.autoCorrect();
    await this.preAppendZeroForMfgDate();
    await this.sanInput();
    await this.getBatch();
    await this.getProvenance();
  }

  // @logStage
  private async getProvenance() {
    // if (!this.prodBatch) return;
    if (this.prodBatch) await this._findUniqueProv();

    if (!this.provenance) await this.getProvSuggestions();
  }
  // ---------------------------------------------------
  // @logStage
  private async getMasterGtinMap() {
    this.masterGtinMap = await MasterGtinMap.findOne({
      childGtins: this.miscInput.gtin,
    });
    if (!this.masterGtinMap)
      log.warn(`master gtin not mapper for ${this.miscInput.gtin}`);
  }
  // @logStage
  private async getMasterVariantAndItem() {
    if (this.masterGtinMap) {
      this.masterVariant = await Variant.findOne({
        gtinKey: this.masterGtinMap.masterGtin,
      });
      if (!this.masterVariant)
        throw new HttpErrors.NotFound(
          `Master gtin for gtin:: ${this.masterGtinMap.masterGtin} not found`,
        );
      this.masterItem = await Item.findOne({_id: this.masterVariant.item});
      if (!this.masterItem)
        throw new HttpErrors.NotFound(
          `Master item for gtin: ${this.masterGtinMap.masterGtin} , itemId ${this.masterVariant.item} not found`,
        );
    }
  }
  // @logStage
  private async getBatch() {
    this.prodBatch = await Batch.findOne({
      name: this.sanitizedInput?.batchName as string,
      variants: this.getReleventVariantId(),
    });
    if (!this.prodBatch)
      this.prodBatch = await Batch.findOne({
        name: this.sanitizedInput?.batchName as string,
        variants: this.getReleventVariantId(),
      });
  }
  // //@logStage
  private getReleventVariantId() {
    return this.masterVariant?._id || this.originalVariant._id;
  }
  // //@logStage
  private getReleventItemId() {
    return this.masterItem?._id || this.originalItem._id;
  }
  // @logStage
  private async _findUniqueProv() {
    const mfgDateQuery = [this.sanitizedInput?.mfgDate];
    if (this.sanitizedInput?.mfgDate)
      mfgDateQuery.push(this.sanitizedInput?.mfgDate);

    const provQueryInput: any = {
      batch: this.prodBatch?._id,
      item: this.getReleventItemId(),
      // plantCode: {$in: this.fssai?.plantCode},
      // mfgDate: this.miscInput?._mfgDate ? {$in: mfgDateQuery} : undefined,
    };
    if (this.fssai?.plantCode) {
      provQueryInput['plantCode'] = {$in: this.fssai?.plantCode};
    }
    if (this.miscInput?._mfgDate)
      _.set(provQueryInput, 'mfgDate', {$in: mfgDateQuery});

    this.provsAggRes = await Provenance.aggregate([
      {$match: provQueryInput},
      {
        $group: {
          _id: '$mfgDate',
          count: {$sum: 1},
        },
      },
    ]);
    if (this.provsAggRes?.length > 1) return;
    else {
      this.provenance = (
        await Provenance.aggregate([
          {$match: provQueryInput},
          {$sort: {updatedAt: this.order}},
          {$limit: 1},
        ])
      )[0];
    }
  }
  // @logStage
  private async autoCorrect() {
    const autoCorrectedRes =
      await this.provSuggCommonService?.autoCorrectMfgDateOrBatchName(
        this.miscInput._batchName,
        this.miscInput._mfgDate,
      );
    if (autoCorrectedRes?.newBatch || autoCorrectedRes?.newMfgDate) {
      this._autoCorrectedInput = {
        batchName: autoCorrectedRes?.newBatch,
        mfgDate: autoCorrectedRes?.newMfgDate,
      };
    }
  }

  private async preAppendZeroForMfgDate() {
    let dateArr: string[] = [];
    let currentSeparator = '';
    let possibleDateSeparators = [' ', '/', '.', '-'];
    possibleDateSeparators.map((sep: string) => {
      if (this.miscInput?._mfgDate?.includes(sep)) {
        dateArr = this.miscInput?._mfgDate.split(sep);
        currentSeparator = sep;
      }
    });
    if (!dateArr[0]?.includes('0') && parseInt(dateArr[0]) < 10) {
      dateArr[0] = '0' + dateArr[0];
    }
    this.miscInput._mfgDate = dateArr.join(currentSeparator);
  }

  private updateYearFormatInMfgDate(mfgDate?: string) {
    const splitData = mfgDate?.split('.') || [];
    let day = splitData[0];
    let month = splitData[1];
    let year = splitData[2];
    if (year.length == 2) {
      year = '20' + year;
    }
    return day + '.' + month + '.' + year;
  }

  private async sanInput() {
    this.sanitizedInput = this._sanitize({
      batchName:
        this._autoCorrectedInput?.batchName || this.miscInput?._batchName,
      mfgDate: this._autoCorrectedInput?.mfgDate || this.miscInput?._mfgDate,
    });
  }

  private _sanitize(input: BatchAndMfg) {
    return {
      batchName: input.batchName?.trim()?.replace(/^0+/, ''),
      mfgDate: this.updateYearFormatInMfgDate(
        input.mfgDate
          ?.trim()
          ?.replace(/[\/\s\-\*_\\]/g, '.')
          .replace(/\.\.+/g, '.'),
      ), // make mutilple .... to .
    };
  }
  // @logStage
  private async getProvSuggestions() {
    this.provSuggInst = new ProvSuggestionsHelper(
      {
        itemId: this.getReleventItemId(),
        batchId: this.prodBatch?._id as unknown as string,
        batchName: this.sanitizedInput?.batchName,
        mfgDate: this.sanitizedInput?.mfgDate,
      },
      this.fssai,
    );
    const ret = await this.provSuggInst.generate();
    this.provenanceSuggestions = ret;
  }
  // private sanitizeData(){
  //   this.batchName =
  // }
}
