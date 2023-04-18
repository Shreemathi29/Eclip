/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import _ from 'lodash';
import {BatchLazyBindingParent} from './batchLazyBindingParent.model';

export async function batchLazyBindingParentAggregateBuilder({
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
  type Query = Parameters<typeof BatchLazyBindingParent.find>[0];
  const query: Query = {};
  const batchQuery: Query = {};
  const productQuery: Query = {};
  const userQuery: Query = {};

  if (criteria) {
    if (criteria.endDate)
      _.set(query, 'createdAt.$lte', new Date(criteria.endDate));
    if (criteria.startDate)
      _.set(query, 'createdAt.$gte', new Date(criteria.startDate));
    if (criteria.product) {
      productQuery['Item.name'] = {$regex: criteria.product, $options: 'i'};
    }
    if (criteria.batch) {
      batchQuery['Batch.name'] = {$regex: criteria.batch, $options: 'i'};
    }
    if (criteria.createdBy) {
      userQuery['User.email'] = {$regex: criteria.createdBy, $options: 'i'};
    }
  }
  const aggregateStages = [
    {$match: query},
    {
      $lookup: {
        from: 'items',
        localField: 'item',
        foreignField: '_id',
        as: 'Item',
      },
    },
    {
      $unwind: {
        path: '$Item',
        preserveNullAndEmptyArrays: true,
      },
    },
    {$match: productQuery},
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
    {$match: batchQuery},
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'User',
      },
    },
    {
      $unwind: {
        path: '$User',
        preserveNullAndEmptyArrays: true,
      },
    },
    {$match: userQuery},
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
  const result = await BatchLazyBindingParent.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  return {
    data: data,
    count: total || 0,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
