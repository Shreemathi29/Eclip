import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import mongoose from 'mongoose';
import {Batch} from '../batch/batch.model';
import {Provenance} from './provenance.model';

type Query = Parameters<typeof Provenance.find>[0];
export class ProvAggregateHelper {
  productIdArr?: mongoose.Types.ObjectId[];
  batchIdArr?: mongoose.Types.ObjectId[];
  gtinIdArr?: mongoose.Types.ObjectId[];
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
    const result = await Provenance.aggregate(this.aggregateStages);

    return {
      data: result,
      count: this.total as number,
      sort: this.queryFilters?.sort,
      sortOrder: this.queryFilters?.sortOrder,
      limit: this.queryFilters?.limit,
      skip: this.queryFilters?.skip,
    };
  }

  private async getProductIdArr() {
    const productRes = await Item.find(
      {
        name: new RegExp(this.queryFilters?.criteria?.product, 'i'),
      },
      {_id: 1},
    );
    this.productIdArr = productRes.map((product: {_id: any}) => product._id);
  }

  private async getBatchIdArr() {
    const batchRes = await Batch.find(
      {
        name: new RegExp(this.queryFilters?.criteria?.batch, 'i'),
      },
      {_id: 1},
    );
    this.batchIdArr = batchRes.map((batch: {_id: any}) => batch._id);
  }

  private async getGtinIdArr() {
    const gtinRes = await Variant.find(
      {
        name: new RegExp(this.queryFilters?.criteria?.gtin, 'i'),
      },
      {_id: 1},
    );
    this.gtinIdArr = gtinRes.map((gtin: {_id: any}) => gtin._id);
  }

  private async prepareMatchFilters() {
    this.query = {};
    if (this.queryFilters?.criteria) {
      if (this.queryFilters?.criteria?.provenance) {
        this.query.name = {
          $regex: this.queryFilters?.criteria?.provenance,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.plantCode) {
        this.query.plantCode = {
          $regex: this.queryFilters?.criteria?.plantCode,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.mfgDate) {
        this.query.mfgDate = {
          $regex: this.queryFilters?.criteria?.mfgDate,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.product) {
        await this.getProductIdArr();
        this.query.item = {$in: this.productIdArr};
      }
      if (this.queryFilters?.criteria?.batch) {
        await this.getBatchIdArr();
        this.query.batch = {$in: this.batchIdArr};
      }
      if (this.queryFilters?.criteria?.gtin) {
        await this.getGtinIdArr();
        this.query.variant = {$in: this.gtinIdArr};
      }

      if (this.queryFilters?.criteria?.provenance_in) {
        this.query._id = {
          $in: this.queryFilters?.criteria?.provenance_in?.map((x: any) => {
            return new mongoose.Types.ObjectId(x);
          }),
        };
      }
    }
  }

  private async prepareAggregateStages() {
    console.log('this.query', this.query);
    this.aggregateStages = [
      {$match: this.query},
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
          from: 'batches',
          localField: 'batch',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'Batch',
        },
      },
      {
        $unwind: {
          path: '$Batch',
          preserveNullAndEmptyArrays: true,
        },
      },
      // product lookup
      {
        $lookup: {
          from: 'items',
          localField: 'item',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'Product',
        },
      },

      {
        $unwind: {
          path: '$Product',
          preserveNullAndEmptyArrays: true,
        },
      },
      // gtin lookup
      {
        $lookup: {
          from: 'variants',
          localField: 'variant',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
          as: 'Variant',
        },
      },

      {
        $unwind: {
          path: '$Variant',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Provenance template lookup
      {
        $lookup: {
          from: 'provenancetemplates',
          localField: 'provenanceTemplate',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
              },
            },
          ],
          as: 'ProvenanceTemplate',
        },
      },

      {
        $unwind: {
          path: '$ProvenanceTemplate',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          mfgDate: 1,
          plantCode: 1,
          Batch: 1,
          Product: 1,
          Variant: 1,
          ProvenanceTemplate: 1,
        },
      },
    ];
  }

  private async getTotalCount() {
    const ret: any = await Provenance.aggregate([
      {$match: this.query},
      {
        $count: 'count',
      },
    ]);
    this.total = ret[0]?.count;
  }
}
