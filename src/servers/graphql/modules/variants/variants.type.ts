/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const VariantTypedefs = gql`
  input filterGtinsBy {
    name: String
    startDate: GDate
    endDate: GDate
  }
  type Gtin {
    _id: ID
    item: ID
    name: String
    lname: String
    from: String
    price: String
    quantity: String
    quantityMetric: String
    gtinKey: String
    desc: [DescSchemaOutput]
    assets: AllAssetsSchemaOutput
    attrs: [AttrSchemaOutput]
    date_attrs: [DateAttrSchemaOutput]
    klefki_id: String
    batches: [Batch]
    product: Product
    createdAt: GDate
    updatedAt: GDate
  }
  type Gtins {
    data: [Gtin]
    count: Int
    sort: String
    sortOrder: SortOrder
    limit: Int
    skip: Int
  }
  input GtinsWhereInput {
    productId: String!
  }
  input updateGtinInput {
    name: String!
    desc: [DescSchemaInput]
    assets: AllAssetsSchemaInput
    attrs: [AttrSchemaInput]
    date_attrs: [DateAttrSchemaInput]
    gtinKey: String!
  }
  extend type Query {
    getGtin(gtin_id: String!): Gtin
    getGtinsByProductID(where: GtinsWhereInput!): [Gtin]
    findGtins(
      criteria: filterGtinsBy
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): Gtins
  }
  extend type Mutation {
    createGtin(
      name: String!
      desc: [DescSchemaInput]
      assets: AllAssetsSchemaInput
      attrs: [AttrSchemaInput]!
      date_attrs: [DateAttrSchemaInput]
      item: ID!
      gtinKey: String!
    ): Gtin
    updateGtin(gtinId: ID!, data: updateGtinInput!): Gtin
    uploadGtins(file: String!): String
    issueGtinCredential(gtinKey: String): JSON
  }
`;
