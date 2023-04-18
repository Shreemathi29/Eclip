import {Batch, IBatch} from './batch.model';

export async function batchAggregateBuilder({
  criteria = {},
  skip = 0,
  limit = 50000,
  sort = '_id',
  sortOrder = 'desc',
}: {
  criteria: any;
  skip: number;
  limit: number;
  sort: string;
  sortOrder: string;
}) {
  type Query = Parameters<typeof Batch.find>[0];
  const query: Query = {};
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
    // {$match: secondStageQuery},

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

  const result = await Batch.aggregate(aggregateStages);
  const {data, total} = result?.[0];
  return {
    data: data as IBatch[],
    count: total,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
