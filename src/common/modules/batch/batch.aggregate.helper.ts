import mongoose from 'mongoose';
import {Batch} from '../batch/batch.model';

type Query = Parameters<typeof Batch.find>[0];
export class BatchAggregateHelper {
  total?: number;
  aggregateStages?: any[];
  query?: Query;
  constructor(
    private queryFilters: {
      criteria: any;
      skip: number;
      limit: number;
      sort: string;
      sortOrder: string;
    },
  ) {}

  public async get() {
    await this.prepareMatchFilters();
    await this.prepareAggregateStages();
    await this.getTotalCount();
    // get final provenance
    const result = await Batch.aggregate(this.aggregateStages);

    return {
      data: result,
      count: this.total as number,
      sort: this.queryFilters?.sort,
      sortOrder: this.queryFilters?.sortOrder,
      limit: this.queryFilters?.limit,
      skip: this.queryFilters?.skip,
    };
  }

  private async prepareMatchFilters() {
    this.query = {};
    this.query.variants = mongoose.Types.ObjectId(
      this.queryFilters?.criteria?.gtinId,
    );
  }

  private async prepareAggregateStages() {
    this.aggregateStages = [
      {
        $match: this.query,
      },
      {
        $sort: {
          [this.queryFilters?.sort?.replace('___', '.')]:
            this.queryFilters?.sortOrder === 'desc' ? -1 : 1,
        },
      },
      {$skip: this.queryFilters?.skip},
      {$limit: this.queryFilters?.limit},
      // batch lookup
      {
        $lookup: {
          from: 'batchlazybindingparents',
          localField: '_id',
          foreignField: 'batch',
          pipeline: [
            {
              $project: {
                _id: 1,
                hash: 1,
              },
            },
          ],
          as: 'BatchLazyBindingParent',
        },
      },
      {
        $unwind: {
          path: '$BatchLazyBindingParent',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          manufactureDate: 1,
          BatchLazyBindingParent: 1,
        },
      },
    ];
  }

  private async getTotalCount() {
    const ret: any = await Batch.aggregate([
      {$match: this.query},
      {
        $count: 'count',
      },
    ]);
    this.total = ret[0]?.count;
  }
}
