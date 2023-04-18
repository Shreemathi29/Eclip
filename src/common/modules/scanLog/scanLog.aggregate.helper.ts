import _ from 'lodash';
import {IScanLog, ScanLog} from './scanLog.model';

type Query = Parameters<typeof ScanLog.find>[0];
export class ScanLogAggregateHelper {
  aggregateStages?: any[];
  query?: Query;
  constructor(
    private queryFilters: {
      criteria: any;
      skip: number;
      limit: number;
      sort: string;
      sortOrder: string;
    },
  ) {}

  public async get() {
    await this.prepareMatchFilters();
    await this.prepareAggregateStages();
    const result = await ScanLog.aggregate(this.aggregateStages);
    const {data, total} = result?.[0];
    return {
      data: data as IScanLog[],
      count: total || 0,
      sort: this.queryFilters?.sort,
      sortOrder: this.queryFilters?.sortOrder,
      limit: this.queryFilters?.limit,
      skip: this.queryFilters?.skip,
    };
  }

  private async prepareMatchFilters() {
    this.query = {};
    if (this.queryFilters?.criteria) {
      if (this.queryFilters?.criteria?.device) {
        this.query.appMode = {
          $regex: this.queryFilters?.criteria?.device,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.purpose_nin) {
        this.query.purpose = {
          $nin: this.queryFilters?.criteria?.purpose_nin,
        };
      }
      if (this.queryFilters?.criteria.interface) {
        this.query.scanType = {
          $regex: this.queryFilters?.criteria?.interface,
          $options: 'i',
        };
      }
      if (!_.isEmpty(this.queryFilters?.criteria?.batch)) {
        this.query.batchNo = {
          $regex: this.queryFilters?.criteria?.batch,
          $options: 'i',
        };
      }
      if (!_.isEmpty(this.queryFilters?.criteria?.product)) {
        this.query.productName = {
          $regex: this.queryFilters?.criteria?.product,
          $options: 'i',
        };
      }
      if (!_.isEmpty(this.queryFilters?.criteria?.status)) {
        this.query.status = this.queryFilters?.criteria?.status;
      }
      if (this.queryFilters?.criteria?.serialNo) {
        this.query.serialNo = this.queryFilters?.criteria?.serialNo;
      }
      if (this.queryFilters?.criteria?.endDate)
        _.set(
          this.query,
          'createdAt.$lte',
          new Date(this.queryFilters?.criteria?.endDate),
        );
      if (this.queryFilters?.criteria?.startDate)
        _.set(
          this.query,
          'createdAt.$gte',
          new Date(this.queryFilters?.criteria?.startDate),
        );

      if (!_.isNil(this.queryFilters?.criteria?.onlyBrandProtectionValid)) {
        if (this.queryFilters?.criteria?.onlyBrandProtectionValid) {
          _.set(this.query, 'isShelfLifeExceeded.$ne', true);
        } else {
          _.set(this.query, 'isShelfLifeExceeded.$eq', true);
        }
      }
      if (this.queryFilters?.criteria?.email) {
        this.query.who = {
          $regex: this.queryFilters?.criteria?.email,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.who_contains_i)
        this.query.who = new RegExp(
          this.queryFilters?.criteria?.who_contains_i,
          'i',
        );
      if (this.queryFilters?.criteria?.city)
        this.query['location.city'] = new RegExp(
          this.queryFilters?.criteria?.city,
          'i',
        );
      if (this.queryFilters?.criteria?.state)
        this.query['location.region'] = new RegExp(
          this.queryFilters?.criteria?.state,
          'i',
        );
      if (this.queryFilters?.criteria?.country)
        this.query['location.country'] = new RegExp(
          this.queryFilters?.criteria?.country,
          'i',
        );
    }
  }

  private async prepareAggregateStages() {
    this.aggregateStages = [
      {$match: this.query},
      {
        $sort: {
          [this.queryFilters?.sort?.replace('___', '.')]:
            this.queryFilters?.sortOrder === 'desc' ? -1 : 1,
        },
      },
      {
        $facet: {
          metadata: [{$count: 'total'}],
          data: [
            {$skip: this.queryFilters?.skip},
            {$limit: this.queryFilters?.limit},
          ],
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
  }
}
