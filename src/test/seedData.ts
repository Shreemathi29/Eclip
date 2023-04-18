import {models, Types} from 'mongoose';

export const createProductInput = {
  name: `Johnnie Walker Black Label ${Date.now()}`,
  desc: [
    {
      val: `Johnnie Walker No. 1`,
    },
  ],
  assets: {
    imgs: [
      {
        src: 'https://dydza6t6xitx6.cloudfront.net/ci-johnnie-walker-black-label-5daa91764fd72be6.jpeg',
      },
    ],
  },
  attrs: [
    {
      name: 'ingridients',
      val: 'Demineralised water, Neutral spirit',
    },
  ],
};
export const updateProductInput = {
  productId: Types.ObjectId(), // Passing it dynamically
  data: {
    name: `Black Dog ${Date.now()}`,
    attrs: [
      {
        name: 'ingridients',
        val: 'Neutral spirit, Demineralised water',
      },
    ],
  },
};

export const createBatchInput = {
  where: {
    productId: Types.ObjectId(), //Passing it dynamically
  },
  data: {
    name: `default ${Date.now()}`,
    creatorUser: '', //Passing it dynamically
    description: 'Test batch desc',
    shelfLife: '2021-11-01T00:00:00',
  },
};

export const updateBatchInput = {
  batch_id: Types.ObjectId(),
  data: {
    description: 'Test Batch description',
    isLocked: true,
    validFrom: '2021-10-01T00:00:00',
    validUntil: '2022-03-01T00:00:00',
  },
};

export const createVariantInput = {
  name: `Variant  ${Date.now()}`,
  gtinKey: `${Date.now()}`,
  item: '', // passing it dynamically
  attrs: [
    {
      name: 'quantity',
      val: '750 ml',
    },
  ],
};

export const updateVariantInput = {
  gtinId: Types.ObjectId(), //passing it dynamically
  data: {
    name: `Variant  ${Date.now()}`,
    gtinKey: `${Date.now()}`,
  },
};
export enum sortOrder {
  asc = 'asc',
  desc = 'desc',
}
export const TableInput = {
  criteria: '',
  limit: 1,
  skip: 0,
  sort: '_id',
  sortOrder: sortOrder.asc,
};

export const createSerializationGroupInput = {
  data: {
    description: 'Test serializationGroup desc',
    maxItems: 1000,
  },
};

export const createEntityRangeInput = {
  data: {
    lowerBound: 1,
    upperBound: 2,
  },
  // passing all ids dynamically
  serializationGroupId: Types.ObjectId(),
  productBatchId: Types.ObjectId(),
  gtinId: Types.ObjectId(),
};

export async function getUserObj() {
  const user = await models.user.findOne({});
  return user;
}
export async function getProductObj() {
  const product = await models.item.findOne({});
  return product;
}
export async function getBatchObj() {
  const batch = await models.batch.findOne({});
  return batch;
}
export async function getVariantObj() {
  const variant = await models.variant.findOne({});
  return variant;
}
export async function getProvenanceObj() {
  const provenance = await models.provenance.findOne({});
  return provenance;
}
export async function getSerializationGroupObj() {
  const serializationGroup = await models.serializationGroup.findOne({});
  return serializationGroup;
}
export async function getEntityRangeObj() {
  const entityRange = await models.entityRange.find({});
  return entityRange[entityRange.length - 1];
}
