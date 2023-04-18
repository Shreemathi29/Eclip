import _ from 'lodash';
import {Campaign} from './campaign.model';

type Query = Parameters<typeof Campaign.find>[0];
export class CampaignAggregateHelper {
  total?: number;
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
    await this.getTotalCount();
    // get final provenance
    const result = await Campaign.aggregate(this.aggregateStages);
    return {
      data: result,
      count: this.total as number,
      sort: this.queryFilters?.sort,
      sortOrder: this.queryFilters?.sortOrder,
      limit: this.queryFilters?.limit,
      skip: this.queryFilters?.skip,
    };
  }

  private async prepareMatchFilters() {
    this.query = {};
    if (this.queryFilters?.criteria) {
      if (this.queryFilters?.criteria?.name) {
        this.query.name = {
          $regex: this.queryFilters?.criteria?.name,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.status) {
        this.query.plantCode = {
          $regex: this.queryFilters?.criteria?.status,
          $options: 'i',
        };
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
      {$skip: this.queryFilters?.skip},
      {$limit: this.queryFilters?.limit},
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          status: 1,
          data: 1,
        },
      },
    ];
  }

  private async getTotalCount() {
    const ret: any = await Campaign.aggregate([
      {$match: this.query},
      {
        $count: 'count',
      },
    ]);
    this.total = ret[0]?.count;
  }
}
