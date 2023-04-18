/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Holder, IHolder} from './holder.model';
export const DEFAULT_HOLDER_LIMIT = 100;
export const DEFAULT_HOLDER_SKIP = 0;
export async function holderAggregateBuilder({
  criteria = {},
  skip = DEFAULT_HOLDER_SKIP,
  limit = DEFAULT_HOLDER_LIMIT,
  sort = '_id',
  sortOrder = 'desc',
}: {
  criteria: any;
  skip: number;
  limit: number;
  sort: string;
  sortOrder: string;
}) {
  type Query = Parameters<typeof Holder.find>[0];
  const query: Query = {};

  if (criteria) {
    if (criteria.email) {
      query.email = {$regex: criteria.email, $options: 'i'};
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

  const result = await Holder.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  const pageSize = limit ?? DEFAULT_HOLDER_LIMIT;
  return {
    data: data as IHolder[],
    currentPage: (skip ?? DEFAULT_HOLDER_SKIP) / pageSize + 1,
    pageSize,
    totalCount: total as number,
    totalPages: Math.floor((total + pageSize - 1) / pageSize),
  };
}
