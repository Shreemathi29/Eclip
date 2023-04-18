import {Types} from 'mongoose';
import {Persona} from './persona.model';

type Query = Parameters<typeof Persona.find>[0];
export class PersonaAggregateHelper {
  aggregateStages?: any[];
  query?: Query;
  userQuery?: Query;
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
    const result = await Persona.aggregate(this.aggregateStages);
    const {data, total} = result?.[0];
    return {
      data: data,
      count: total as number,
      sort: this.queryFilters?.sort,
      sortOrder: this.queryFilters?.sortOrder,
      limit: this.queryFilters?.limit,
      skip: this.queryFilters?.skip,
    };
  }

  private async prepareMatchFilters() {
    this.query = {};
    this.userQuery = {};
    if (this.queryFilters?.criteria) {
      if (this.queryFilters?.criteria?.personaId) {
        this.query._id = Types.ObjectId(this.queryFilters?.criteria?.personaId);
      }
      if (this.queryFilters?.criteria?.name) {
        this.userQuery['users.name'] = {
          $regex: this.queryFilters?.criteria?.name,
          $options: 'i',
        };
      }
      if (this.queryFilters?.criteria?.email) {
        this.userQuery['users.email'] = {
          $regex: this.queryFilters?.criteria?.email,
          $options: 'i',
        };
      }
    }
  }

  private async prepareAggregateStages() {
    this.aggregateStages = [
      {$match: this.query},
      {$unwind: '$users'},
      {$match: this.userQuery},
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
