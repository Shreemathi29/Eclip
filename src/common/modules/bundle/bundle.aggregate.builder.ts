/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Bundle, IBundle} from './bundle.model';

export async function bundleAggregateBuilder({
  criteria = {},
  skip = 0,
  limit = 10,
  sort = '_id',
  sortOrder = 'desc',
}: {
  criteria?: {client_id?: string};
  skip?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
}) {
  type Query = Parameters<typeof Bundle.find>[0];
  const query: Query = {};

  if (criteria) {
    // if (criteria.client_id) {
    //   query.client_id = criteria.client_id;
  }

  const aggregateStages = [
    {$match: query},
    // {
    //   $lookup: {
    //     from: 'application',
    //     localField: '_id',
    //     foreignField: 'bundles',
    //     as: 'Application',
    //   },
    // },
    // {
    //   $unwind: {
    //     path: '$Application',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
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

  const result = await Bundle.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  return {
    data: data as IBundle[],
    count: total,
    sort,
    sortOrder,
    limit,
    skip,
    current_page: skip / limit + 1,
    page_size: limit,
    total_count: total,
    total_pages: Math.floor((total + limit - 1) / limit) as number,
  };
}
