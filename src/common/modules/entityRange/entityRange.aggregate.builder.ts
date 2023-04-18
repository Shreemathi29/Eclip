import mongoose from 'mongoose';
import {EntityRange} from './entityRange.model';

export async function entityRangeAggregateBuilder({
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
  type Query = Parameters<typeof EntityRange.find>[0];
  const query: Query = {};
  // const nameQuery: Query = {};
  if (criteria.serializationGroupId) {
    query.serializationGroup = mongoose.Types.ObjectId(
      criteria.serializationGroupId,
    );
  }
  // const secondStageQuery: Query = {};

  const aggregateStages = [
    {$match: query},
    {
      $lookup: {
        from: 'variants',
        localField: 'variant',
        foreignField: '_id',
        as: 'Variant',
      },
    },

    {
      $unwind: {
        path: '$Variant',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'items',
        localField: 'item',
        foreignField: '_id',
        as: 'Product',
      },
    },

    {
      $unwind: {
        path: '$Product',
        preserveNullAndEmptyArrays: true,
      },
    },
    // -----------------------------------------------
    {
      $lookup: {
        from: 'batches',
        localField: 'batch',
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
    // ----------------------------------
    {
      $lookup: {
        from: 'serializationgroups',
        localField: 'serializationGroup',
        foreignField: '_id',
        as: 'SerializationGroup',
      },
    },

    {
      $unwind: {
        path: '$SerializationGroup',
        preserveNullAndEmptyArrays: true,
      },
    },

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

  const result = await EntityRange.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  return {
    data: data,
    count: total,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
