/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Campaign} from './campaign.model';

export async function campaignAggregateBuilder({
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
  type Query = Parameters<typeof Campaign.find>[0];
  const query: Query = {};

  const aggregateStages = [
    {$match: query},
    {
      $lookup: {
        from: 'variants',
        localField: 'gtin',
        foreignField: '_id',
        as: 'Gtin',
      },
    },

    {
      $unwind: {
        path: '$Gtin',
        preserveNullAndEmptyArrays: true,
      },
    },

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

  const result = await Campaign.aggregate(aggregateStages);
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
