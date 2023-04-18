/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import _ from 'lodash';
import {Report} from './report.model';

export async function reportAggregator({
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
  type Query = Parameters<typeof Report.find>[0];
  const query: Query = {};
  if (criteria) {
    if (criteria.status) {
      query.status = {$regex: criteria.status, $options: 'i'};
    }
    if (criteria.tableName) {
      query.tableName = {$regex: criteria.tableName, $options: 'i'};
    }
    if (criteria.mfgDate) {
      query.mfgDate = {$regex: criteria.mfgDate};
    }
    if (criteria.endDate)
      _.set(query, 'createdAt.$lte', new Date(criteria.endDate));
    if (criteria.startDate)
      _.set(query, 'createdAt.$gte', new Date(criteria.startDate));
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
  const result = await Report.aggregate(aggregateStages);
  const {data, total} = result?.[0];
  return {
    data: data,
    count: total as number,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
