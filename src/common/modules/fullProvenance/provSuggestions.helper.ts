/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {IFssai} from '../fssai/fssai.model';
import {IProvenance, Provenance} from '../provenance';
import {logStage} from '../provenance/issueManyProvCred.utils';

type BatchAndMfg = {
  batchName: string | null | undefined;
  mfgDate: string | null | undefined;
};

export class ProvSuggestionsHelper {
  public provenance: IProvenance | null = null;

  public batchProvAgg: {_id: string; count: number}[] = [];
  public mfgProvAgg: {batchName: string; count: number}[] = [];
  public displayProvObj: any = {};
  constructor(
    private miscInput: {
      itemId: string;
      batchId: string;
      mfgDate: string | null | undefined;
      batchName: string | null | undefined;
    },
    private fssaiData?: IFssai | null | undefined,
  ) {}

  public async generate() {
    await this.checkIfPorvExists();
    await this.fetchBatchSuggestions();
    await this.fetchMfgDateSuggestions();
    await this.finish();

    return {
      displayProvObj: this.displayProvObj,
    };
  }
  @logStage
  private async checkIfPorvExists() {
    const provData: any = {
      item: this.miscInput.itemId,
    };
    if (this.fssaiData?.plantCode) {
      provData['plantCode'] = {$in: this.fssaiData?.plantCode || []};
    }
    this.provenance = await Provenance.findOne(provData);
    if (!this.provenance) {
      throw new HttpErrors.NotFound(`Provenance not found`);
    }
  }
  @logStage
  private async fetchBatchSuggestions() {
    if (this.miscInput.batchId) {
      const matchQuery: any = {
        item: this.miscInput.itemId,
        batch: this.miscInput.batchId || null,
      };
      if (this.fssaiData?.plantCode) {
        matchQuery['plantCode'] = {$in: this.fssaiData?.plantCode || []};
      }
      this.batchProvAgg = await Provenance.aggregate([
        {
          $match: matchQuery,
        },
        {$limit: 1000},
        {
          $group: {
            _id: '$mfgDate',
            count: {$sum: 1},
          },
        },
        {
          $lookup: {
            from: 'batches',
            localField: '_id',
            foreignField: '_id',
            as: 'Batch',
          },
        },
        {
          $unwind: {
            path: '$Batch',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            batchName: '$Batch.name',
          },
        },
      ]);
    }
  }
  @logStage
  private async fetchMfgDateSuggestions() {
    if (this.miscInput.mfgDate) {
      const matchQuery: any = {
        item: this.miscInput.itemId,
        mfgDate: this.miscInput.mfgDate,
      };
      if (this.fssaiData?.plantCode) {
        matchQuery['plantCode'] = {$in: this.fssaiData?.plantCode || []};
      }
      this.mfgProvAgg = await Provenance.aggregate([
        {
          $match: matchQuery,
        },
        {$limit: 1000},
        {
          $group: {
            _id: '$batch',
            count: {$sum: 1},
          },
        },
        {
          $lookup: {
            from: 'batches',
            localField: '_id',
            foreignField: '_id',
            as: 'Batch',
          },
        },
        {
          $unwind: {
            path: '$Batch',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            count: 1,
            batchName: '$Batch.name',
          },
        },
      ]);
    }
  }
  @logStage
  private async finish() {
    if (_.isEmpty(this.batchProvAgg) && _.isEmpty(this.mfgProvAgg))
      throw new HttpErrors.NotFound(
        `The track and trace information not available for requested provenance`,
      );
    if (this.miscInput.batchName && !_.isEmpty(this.batchProvAgg)) {
      // this.displayProvObj = this.batchProvAgg;
      this.displayProvObj[this.miscInput.batchName] = _.uniq(
        this.batchProvAgg.map(x => x._id),
      );
    }
    if (this.miscInput.mfgDate && !_.isEmpty(this.mfgProvAgg)) {
      // this.displayProvObj = this.batchProvAgg;
      this.displayProvObj[this.miscInput.mfgDate] = _.uniq(
        this.mfgProvAgg.map(x => x.batchName),
      );
    }
  }
}
// If only batch name match
// const provMatchedWithBatch = await Provenance.find(
//   {
//     item: this.miscInput.itemId,
//     plantCode: {$in: this.fssaiData?.plantCode || []},
//     batch: this.miscInput.batchId,
//   },
//   {provSteps: 0},
// ).limit(50);
// this.suggestions = this.suggestions.concat(provMatchedWithBatch)
// // if (provMatchedWithBatch.length > 0) {
// //   log.info('--------provMatchedWithBatch');
// //   suggestedProvnances.push(...provMatchedWithBatch);
// // }
// // If only mfgDate match
// const provMatchedWithMfgDate = await Provenance.find({
//   item: this.miscInput.itemId,
//     plantCode: {$in: this.fssaiData?.plantCode || []},
//   mfgDate: this.miscInput.
// }, {provSteps: 0},).limit(50);
// this.suggestions = this.suggestions.concat(provMatchedWithMfgDate)
// // if (provMatchedWithMfgDate.length > 0) {
// //   log.info('--------provMatchedWithMfgDate');
// //   suggestedProvnances.push(...provMatchedWithMfgDate);
// // }
