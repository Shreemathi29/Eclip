/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const EntityRangeTypedefs = gql`
  type EntityRange {
    _id: ID
    lowerBound: Int
    upperBound: Int
    serializationGroup: String
    batch: String
    variant: String
    item: String
  }
  type EntityRangeRowData {
    action: String
    batch: Int
    gtin: String
    lowerLimit: Int
    product: String
    productBatchNo: String
    entityRangeId: String
    upperLimit: Int
  }
  type EntityRangeData {
    columnDefs: [ColumnDefs]
    rowData: [EntityRangeRowData]
  }
  type EntityRangeTableOutput {
    count: Int
    data: EntityRangeData
    limit: Int
    sort: String
  }
  input EntityRangeCriteria {
    onlyBrandProtectionValid: Boolean
  }
  input CreateEntityRangeInput {
    lowerBound: Int
    upperBound: Int
    description: String
  }
  extend type Query {
    entityRangeTable(
      criteria: EntityRangeCriteria
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
  }
  extend type Mutation {
    createEntityRange(
      data: CreateEntityRangeInput!
      serializationGroupId: ID!
      gtinId: ID!
      productBatchId: ID!
    ): EntityRange
  }
`;
