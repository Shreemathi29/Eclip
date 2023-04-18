/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const ProductTypedefs = gql`
  input DescSchemaInput {
    lang: String
    val: String
    desc_type: String
  }

  type DescSchemaOutput {
    lang: String
    val: String
    desc_type: String
  }

  input AssetSchemaInput {
    height: String
    src: String
    width: String
    asset_type: String
  }

  type AssetSchemaOutput {
    height: String
    src: String
    width: String
    asset_type: String
  }

  input AllAssetsSchemaInput {
    imgs: [AssetSchemaInput]
    others: [AssetSchemaInput]
    videos: [AssetSchemaInput]
  }

  type AllAssetsSchemaOutput {
    imgs: [AssetSchemaOutput]
    others: [AssetSchemaOutput]
    videos: [AssetSchemaOutput]
  }

  input AttrSchemaInput {
    name: String!
    val: String!
    disp_type: String
    disp_val: String
    isHidden: Boolean
    tz: String
  }

  type AttrSchemaOutput {
    name: String
    val: String
    disp_type: String
    disp_val: String
    isHidden: Boolean
    tz: String
  }

  input DateAttrSchemaInput {
    name: String
    val: GDate
    disp_type: String
    disp_val: String
    isHidden: Boolean
    tz: String
  }

  type DateAttrSchemaOutput {
    name: String
    val: GDate
    disp_type: String
    disp_val: String
    isHidden: Boolean
    tz: String
  }

  type Product {
    _id: ID
    name: String
    lname: String
    orgName: String
    description: String
    ingredients: String
    instructions: String
    subtitle: String
    images: [String]
    productImageUrl: [String]
    desc: [DescSchemaOutput]
    assets: AllAssetsSchemaOutput
    attrs: [AttrSchemaOutput]
    date_attrs: [DateAttrSchemaOutput]
    brand: Brand
    website: String
    createdAt: GDate
    updatedAt: GDate
    gtins: [Gtin]
  }
  type Products {
    data: [Product]
    count: Int
    sort: String
    sortOrder: SortOrder
    limit: Int
    skip: Int
  }
  input filterBy {
    name: String
    startDate: GDate
    endDate: GDate
    donwload: Boolean
  }
  input editProductInput {
    name: String!
    desc: [DescSchemaInput]
    assets: AllAssetsSchemaInput
    attrs: [AttrSchemaInput]
    date_attrs: [DateAttrSchemaInput]
  }
  extend type Mutation {
    createProduct(
      name: String!
      desc: [DescSchemaInput]
      assets: AllAssetsSchemaInput
      attrs: [AttrSchemaInput]!
      date_attrs: [DateAttrSchemaInput]
    ): Product
    updateProduct(productId: ID!, data: editProductInput!): Product
    uploadProducts(file: String!): String
  }
  extend type Query {
    getProducts(
      criteria: filterBy
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): Products
    getProduct(productId: ID!): Product
  }
`;
