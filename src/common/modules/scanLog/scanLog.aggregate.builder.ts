import _ from 'lodash';
import {IScanLog, ScanLog} from './scanLog.model';
const yaml_config = require('node-yaml-config');
// --------------blacklist----------------------------
// const blacklistConfig = yaml_config.load('./src/config/blacklist.config.yml');
// const blacklistedEmail =
// 	Array.isArray(blacklistConfig.emails) && blacklistConfig.emails;
// const blacklistMatch = blacklistedEmail
// 	? {who: {$nin: blacklistConfig.emails}}
// 	: {};
//  -------------------------------------------------------------------------
type Query = Parameters<typeof ScanLog.find>[0];
export async function scanLogAggregateBuilder({
  criteria,
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
  const query: Query = {};
  if (criteria.device) {
    query.appMode = {$regex: criteria.device, $options: 'i'};
  }
  if (criteria.interface) {
    query.scanType = {$regex: criteria.interface, $options: 'i'};
  }
  if (!_.isEmpty(criteria.batch)) {
    query.batchNo = {$regex: criteria.batch, $options: 'i'};
  }
  if (!_.isEmpty(criteria.product)) {
    query.productName = {$regex: criteria.product, $options: 'i'};
  }
  if (!_.isEmpty(criteria.status)) {
    query.status = criteria.status;
  }
  if (criteria.serialNo) {
    query.serialNo = criteria.serialNo;
  }
  if (criteria.endDate)
    _.set(query, 'createdAt.$lte', new Date(criteria.endDate));
  if (criteria.startDate)
    _.set(query, 'createdAt.$gte', new Date(criteria.startDate));

  if (!_.isNil(criteria.onlyBrandProtectionValid)) {
    if (criteria.onlyBrandProtectionValid) {
      _.set(query, 'isShelfLifeExceeded.$ne', true);
    } else {
      _.set(query, 'isShelfLifeExceeded.$eq', true);
    }
  }
  if (criteria.email) {
    query.who = {$regex: criteria.email, $options: 'i'};
  }
  if (criteria.who_contains_i)
    query.who = new RegExp(criteria.who_contains_i, 'i');
  if (criteria.city) query['location.city'] = new RegExp(criteria.city, 'i');
  if (criteria.state)
    query['location.region'] = new RegExp(criteria.state, 'i');
  if (criteria.country)
    query['location.country'] = new RegExp(criteria.country, 'i');

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

  const result = await ScanLog.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  return {
    data: data as IScanLog[],
    count: total || 0,
    sort,
    sortOrder,
    limit,
    skip,
  };
}
