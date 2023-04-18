import {
  ISerializationGroup,
  SerializationGroup,
} from './serializationGroup.model';

// import {SerializationGroup, ISerializationGroup} from './campaign.model';

export async function serializationGroupAggregateBuilder({
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
  type Query = Parameters<typeof SerializationGroup.find>[0];
  const query: Query = {};

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

  const result = await SerializationGroup.aggregate(aggregateStages);
  const {data, total} = result?.[0];

  return {
    data: data as SerializationGroupAggrData[],
    count: total,
    sort,
    sortOrder,
    limit,
    skip,
  };
}

export type SerializationGroupAggrData = ISerializationGroup;
