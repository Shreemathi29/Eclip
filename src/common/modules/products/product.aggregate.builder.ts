/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Item} from '@vlinder-be/asset-catalogue-module/dist/module/controllers/item/item.model';
import {ProductHelper} from './product.helper';

export async function productAggregator({
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
  type Query = Parameters<typeof Item.find>[0];
  const query: any = {}; // replaced type Query with any
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
      $lookup: {
        from: 'brands',
        localField: 'brand',
        foreignField: '_id',
        as: 'Brand',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: {
        path: '$Brand',
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
  const result = await Item.aggregate(aggregateStages);
  const {data, total} = result?.[0];
  let itemsArray: any = [];
  if (data) {
    const productHelper = new ProductHelper();
    itemsArray = data.map((item: any) => {
      return productHelper.getProductResponse(item);
    });
  }
  return {
    data: itemsArray,
    count: total as number,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
