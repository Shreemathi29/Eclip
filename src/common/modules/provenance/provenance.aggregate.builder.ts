import {Provenance} from './provenance.model';

export async function provenanceAggregator({
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
  type Query = Parameters<typeof Provenance.find>[0];
  const query: Query = {};
  const batchQuery: Query = {};
  const productQuery: Query = {};
  const gtinQuery: Query = {};
  if (criteria) {
    if (criteria.provenance) {
      query._id = {_id: criteria.provenance};
    }
    if (criteria.provenance_in) {
      query._id = {$in: criteria.provenance_in};
    }
    if (criteria.plantCode) {
      query.plantCode = {$regex: criteria.plantCode, $options: 'i'};
    }
    if (criteria.mfgDate) {
      query.mfgDate = {$regex: criteria.mfgDate, $options: 'i'};
    }
    if (criteria.product) {
      productQuery['Product.name'] = {$regex: criteria.product, $options: 'i'};
    }
    if (criteria.batch) {
      batchQuery['Batch.name'] = {$regex: criteria.batch, $options: 'i'};
    }
    if (criteria.gtin) {
      gtinQuery['Variant.name'] = {$regex: criteria.gtin, $options: 'i'};
    }
  }
  const aggregateStages = [
    {$match: query},
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
        from: 'items',
        localField: 'item',
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

    {$match: productQuery},

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

    {$match: gtinQuery},

    {
      $lookup: {
        from: 'provenancetemplates',
        localField: 'provenanceTemplate',
        foreignField: '_id',
        as: 'ProvenanceTemplate',
      },
    },

    {
      $unwind: {
        path: '$ProvenanceTemplate',
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
  const result = await Provenance.aggregate(aggregateStages);
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
