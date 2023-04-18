/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils/logging';
import {bind, BindingScope} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import mongoose from 'mongoose';
import {Batch} from '../batch/batch.model';
import {Fssai} from '../fssai/fssai.model';
import {Provenance} from '../provenance/provenance.model';

@bind({scope: BindingScope.SINGLETON})
export class ProvSuggestionsCommonService {
  constructor() {}

  async getFullProvSuggestions(input: any) {
    // first find provenace using barcode and fssai
    // get gtin using barcode
    let provenance = null;
    let mfgDateAutoCorrected = false;
    let batchAutoCorrected = false;
    const variant = await Variant.findOne({gtinKey: input.barcode});
    if (!variant)
      throw new HttpErrors.NotFound(
        `getFromGtinAndBatch: variant not found: ${input.barcode}}`,
      );
    // get item by variant
    const item = await Item.findOne({_id: variant.item});
    if (!item) throw new HttpErrors.NotFound(`item not found: ${variant.item}`);
    const fssaiData = await Fssai.findOne({fssaiCode: input?.fssai});
    log.info(
      `FSSI code,fssai ${input?.fssai}, plantCode ${fssaiData?.plantCode} =>`,
    );
    provenance = await Provenance.findOne({
      item: item._id,
      plantCode: {$in: fssaiData?.plantCode || []},
    });
    if (!provenance) {
      throw new HttpErrors.NotFound(`Provenance not found`);
    }
    // first check if alphabets present in mfgDate or batchName. auto correct it
    const autoCorrectRes = await this.autoCorrectMfgDateOrBatchName(
      input.batch,
      input.mfgDate,
    );
    if (autoCorrectRes.mfgDateAutoCorrected) {
      mfgDateAutoCorrected = true;
      input.mfgDate = autoCorrectRes.newMfgDate;
    }
    if (autoCorrectRes.batchAutoCorrected) {
      batchAutoCorrected = true;
      input.batch = autoCorrectRes.newBatch;
    }
    // now include batch name and mfgdate and find provenance
    const batch =
      input.batch &&
      (await Batch.findOne({
        name: input.batch,
        variants: variant._id,
      }));
    provenance = await Provenance.findOne({
      item: item._id,
      plantCode: {$in: fssaiData?.plantCode || []},
      batch: batch?._id || mongoose.Types.ObjectId(),
      mfgDate: {
        $in: [
          input.mfgDate?.replace(new RegExp('.', 'g'), '/'),
          correctMfgDate(input.mfgDate),
          input.mfgDate,
        ],
      },
    });
    // If provenance found return it else prepare some suggestions
    if (provenance) {
      log.info('Provenance matched exactly');
      return this.finalSuggestedProvnances(
        [provenance],
        mfgDateAutoCorrected,
        batchAutoCorrected,
      );
    } else {
      const suggestedProvnances: any = [];
      // If only batch name match
      const provMatchedWithBatch = await Provenance.find({
        item: item._id,
        plantCode: {$in: fssaiData?.plantCode || []},
        batch: batch?._id || mongoose.Types.ObjectId(),
      });
      if (provMatchedWithBatch.length > 0) {
        log.info('--------provMatchedWithBatch');
        suggestedProvnances.push(...provMatchedWithBatch);
      }
      // If only mfgDate match
      const provMatchedWithMfgDate = await Provenance.find({
        item: item._id,
        plantCode: {$in: fssaiData?.plantCode || []},
        mfgDate: {
          $in: [correctMfgDate(input.mfgDate), input.mfgDate],
        },
      });
      if (provMatchedWithMfgDate.length > 0) {
        log.info('--------provMatchedWithMfgDate');
        suggestedProvnances.push(...provMatchedWithMfgDate);
      }
      return this.finalSuggestedProvnances(
        suggestedProvnances,
        mfgDateAutoCorrected,
        batchAutoCorrected,
        autoCorrectRes.newBatch,
        autoCorrectRes.newMfgDate,
        input.batch,
        input.mfgDate,
      );
    }
  }

  private async finalSuggestedProvnances(
    provenances: any,
    mfgDateAutoCorrected: boolean = false,
    batchAutoCorrected: boolean = false,
    autoCorredtedBatchName: any = null,
    autoCorrectedMfgDate: any = null,
    reqBatch: any = null,
    reqMfgDate: any = null,
  ) {
    let res: any = {};
    res.suggestedProvArr = provenances;
    res.mfgDateAutoCorrected = mfgDateAutoCorrected;
    res.batchAutoCorrected = batchAutoCorrected;
    const displayProvObj: any = {};
    // find all batches for provenance first to to get batch name
    const BatchIdArr = provenances.map((prov: {batch: any}) => prov.batch);
    const batchArr = await Batch.find({
      _id: BatchIdArr,
    });
    // prepare json to get batch data
    let batchObj: any = {};
    batchArr.forEach(function (batch, i) {
      batchObj[batch._id.toString()] = batch.name;
    });
    for (let i = 0; i < provenances.length; i++) {
      // replace batchid with batch name
      provenances[i]['batchName'] = batchObj[provenances[i].batch];
      // when date is auto corrected and matched
      if (
        mfgDateAutoCorrected &&
        autoCorrectedMfgDate &&
        (autoCorrectedMfgDate == provenances[i].mfgDate ||
          correctMfgDate(autoCorrectedMfgDate) == provenances[i].mfgDate ||
          autoCorrectedMfgDate?.replace(new RegExp('.', 'g'), '/') ==
            provenances[i].mfgDate)
      ) {
        if (displayProvObj.hasOwnProperty(provenances[i].mfgDate)) {
          if (
            !displayProvObj[provenances[i].mfgDate].includes(
              provenances[i].batchName,
            )
          ) {
            displayProvObj[provenances[i].mfgDate].push(
              provenances[i].batchName,
            );
          }
        } else {
          displayProvObj[provenances[i].mfgDate] = [];
          displayProvObj[provenances[i].mfgDate].push(provenances[i].batchName);
        }
      }
      // when date is not auto corrected but matched
      if (
        !mfgDateAutoCorrected &&
        (reqMfgDate == provenances[i].mfgDate ||
          correctMfgDate(reqMfgDate) == provenances[i].mfgDate ||
          reqMfgDate?.replace(new RegExp('.', 'g'), '/') ==
            provenances[i].mfgDate)
      ) {
        if (displayProvObj.hasOwnProperty(provenances[i].mfgDate)) {
          if (
            !displayProvObj[provenances[i].mfgDate].includes(
              provenances[i].batchName,
            )
          ) {
            displayProvObj[provenances[i].mfgDate].push(
              provenances[i].batchName,
            );
          }
        } else {
          displayProvObj[provenances[i].mfgDate] = [];
          displayProvObj[provenances[i].mfgDate].push(provenances[i].batchName);
        }
      }
      // when batch is auto corrected and matched
      if (
        batchAutoCorrected &&
        autoCorredtedBatchName &&
        autoCorredtedBatchName == provenances[i].batchName
      ) {
        if (displayProvObj.hasOwnProperty(provenances[i].batchName)) {
          if (
            !displayProvObj[provenances[i].batchName].includes(
              provenances[i].mfgDate,
            )
          ) {
            displayProvObj[provenances[i].batchName].push(
              provenances[i].mfgDate,
            );
          }
        } else {
          displayProvObj[provenances[i].batchName] = [];
          displayProvObj[provenances[i].batchName].push(provenances[i].mfgDate);
        }
      }
      // when batch is not auto corrected but found
      if (!batchAutoCorrected && reqBatch == provenances[i].batchName) {
        if (displayProvObj.hasOwnProperty(provenances[i].batchName)) {
          if (
            !displayProvObj[provenances[i].batchName].includes(
              provenances[i].mfgDate,
            )
          ) {
            displayProvObj[provenances[i].batchName].push(
              provenances[i].mfgDate,
            );
          }
        } else {
          displayProvObj[provenances[i].batchName] = [];
          displayProvObj[provenances[i].batchName].push(provenances[i].mfgDate);
        }
      }
    }
    res.displayProvObj = displayProvObj;
    if (res.suggestedProvArr.length === 0)
      throw new HttpErrors.NotFound(
        `The track and trace information not available for requested provenance`,
      );
    return res;
  }

  async autoCorrectMfgDateOrBatchName(batch: any, mfgDate: any) {
    let mfgDateAutoCorrected: boolean = false;
    let batchAutoCorrected: boolean = false;
    let newMfgDate: null | string = null;
    let newBatch: null | string = null;
    const possibleAlphabets = ['o', 'I', 'l', 'B', 'b', 'g', 's', 'S'];
    const alphabetsToNumberJson: any = {
      o: '0',
      I: '1',
      l: '1',
      B: '8',
      b: '6',
      g: '9',
      s: '5',
      S: '5',
    };
    // remove pre appended zero's from batch
    batch = batch.replace(/^0+/, '');
    possibleAlphabets.forEach(function (alphabet) {
      if (batch.includes(alphabet)) {
        newBatch = batch.replace(
          new RegExp(alphabet, 'g'),
          alphabetsToNumberJson[alphabet],
        );
        batch = newBatch;
        batchAutoCorrected = true;
      }
      if (mfgDate && mfgDate.includes(alphabet)) {
        newMfgDate = mfgDate.replace(
          new RegExp(alphabet, 'g'),
          alphabetsToNumberJson[alphabet],
        );
        mfgDate = newMfgDate;
        mfgDateAutoCorrected = true;
      }
    });
    // now check if year is less than 1st Jan 2022 or greater than current date
    // first find the year from mfg date
    // To find year we need to split mfg date
    // also before split need to indentify pattern of mfg date. '.' or '/'
    // let isDotPresentInMfgDate = mfgDate.includes('.');
    // let isSlashPresentInMfgDate = mfgDate.includes('/');
    // let dateArr = [];
    // if (isDotPresentInMfgDate) {
    //   dateArr = mfgDate.split('.');
    // } else if (isSlashPresentInMfgDate) {
    //   dateArr = mfgDate.split('/');
    // }
    // let currentYear = new Date().getFullYear();
    // // TODO: till 2025 we will get only 0 as diffrent outcomes, will take care for it later
    // if (dateArr[2].includes('8')) {
    //   // because 8 is a possible outcome for value 0
    //   dateArr[2] = dateArr[2].replace('8', '0');
    // }
    // if (parseInt(dateArr[2]) < 2022) {
    //   dateArr[2] = currentYear.toString();
    //   newMfgDate = dateArr.join('/');
    //   mfgDateAutoCorrected = true;
    // }
    return {
      newBatch,
      newMfgDate,
      mfgDateAutoCorrected,
      batchAutoCorrected,
    };
  }
}

export function correctMfgDate(mfgDate: string) {
  return mfgDate?.replace(/[\/\s\-\*_\\]/g, '.').replace(/\.\.+/g, '.');
}
