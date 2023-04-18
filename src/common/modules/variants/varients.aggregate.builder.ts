import {Variant} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/variant/variant.model';
import {VarientsHelper} from './varients.helper';

export async function varientAggregator({
  criteria = {},
  skip = 0,
  limit = 50000,
  sort = '_id',
  sortOrder = 'desc',
}: {
  criteria: any;
  skip?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
}) {
  type Query = Parameters<typeof Variant.find>[0];
  const query: any = {}; // replace Query with any
  if (criteria) {
    if (criteria.name) {
      query.name = {$regex: criteria.name, $options: 'i'};
    }
    if (criteria.startDate || criteria.endDate) {
      const date: any = {};
      if (criteria.startDate) {
        date['$gte'] = criteria.startDate;
      }
      if (criteria.endDate) {
        date['$lte'] = criteria.endDate;
      }
      query.updatedAt = date;
    }
  }

  const aggregateStages = [
    {$match: query},

    {
      $sort: {[sort.replace('___', '.')]: sortOrder === 'desc' ? -1 : 1},
    },

    {
      $facet: {
        metadata: [{$count: 'total'}],
        data: [{$skip: skip}, {$limit: limit}],
      },
    },
    {
      $project: {
        data: 1,
        // Get total from the first element of the metadata array
        total: {$arrayElemAt: ['$metadata.total', 0]},
      },
    },
  ];
  const result = await Variant.aggregate(aggregateStages);
  const {data, total} = result?.[0];
  let variantsArray: any = [];
  if (data) {
    const variantsHelper = new VarientsHelper();
    variantsArray = data.map((variant: any) => {
      return variantsHelper.getVarientResponse(variant);
    });
  }
  return {
    data: variantsArray,
    count: total as number,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
