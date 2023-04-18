/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {IRole} from '../role/role.model';
import {ISearchUserInput, IUser, User, UserProfile} from './user.model';
export const DEFAULT_USER_LIMIT = 100;
export const DEFAULT_USER_SKIP = 0;

export async function userAggregateBuilder(
  {
    criteria = {},
    skip = DEFAULT_USER_SKIP,
    limit = DEFAULT_USER_LIMIT,
    sort = '_id',
    sortOrder = 'desc',
  }: {
    criteria: ISearchUserInput;
    skip: number;
    limit: number;
    sort: string;
    sortOrder: string;
  },
  userProfile?: UserProfile,
) {
  type Query = Parameters<typeof User.find>[0];
  const query: Query = {};
  const roleQuery: Query = {};

  if (criteria) {
    if (criteria.email) {
      query.email = {$regex: criteria.email, $options: 'i'};
    }

    if (criteria.role) {
      roleQuery['Role.name'] = {$regex: criteria.role, $options: 'i'};
    }

    if (criteria.givenName) {
      query.givenName = {$regex: criteria.givenName, $options: 'i'};
    }

    if (criteria.familyName) {
      query.familyName = {$regex: criteria.familyName, $options: 'i'};
    }

    if (criteria.emailVerified) {
      query.emailVerified = true;
    }

    if (criteria.accessForbidden) {
      query.accessForbidden = true;
    }
  }

  const aggregateStages = [
    {$match: query},
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'Role',
      },
    },
    {
      $unwind: {
        path: '$Role',
        preserveNullAndEmptyArrays: true,
      },
    },
    {$match: roleQuery},
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

  const result = await User.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  const pageSize = limit ?? DEFAULT_USER_LIMIT;
  return {
    data: data as (IUser & {Role: IRole})[],
    currentPage: (skip ?? DEFAULT_USER_SKIP) / pageSize + 1,
    pageSize,
    totalCount: total as number,
    totalPages: Math.floor((total + pageSize - 1) / pageSize),
  };
}
