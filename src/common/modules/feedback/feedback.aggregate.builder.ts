/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import _ from 'lodash';
import {Feedback} from './feedback.model';

export async function feedbackAggregateBuilder({
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
  type Query = Parameters<typeof Feedback.find>[0];
  const query: Query = {};
  if (criteria) {
    if (criteria.endDate)
      _.set(query, 'createdAt.$lte', new Date(criteria.endDate));
    if (criteria.startDate)
      _.set(query, 'createdAt.$gte', new Date(criteria.startDate));
    if (criteria.name) {
      query.userName = {$regex: criteria.name, $options: 'i'};
    }
    if (criteria.email) {
      query.email = {$regex: criteria.email, $options: 'i'};
    }
    if (criteria.product) {
      query.productName = {$regex: criteria.product, $options: 'i'};
    }
    if (criteria.batch) {
      query.batchNo = {$regex: criteria.batch, $options: 'i'};
    }
    if (criteria.rating) {
      query.rating = criteria.rating;
    }
    if (criteria.details) {
      query[`details.${criteria.details.key}`] = {
        $regex: criteria.details.value,
        $options: 'i',
      };
    }
  }
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
      $lookup: {
        from: 'items',
        localField: 'product',
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
    {
      $sort: {[sort?.replace('___', '.')]: sortOrder === 'desc' ? -1 : 1},
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
  const result = await Feedback.aggregate(aggregateStages);
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
