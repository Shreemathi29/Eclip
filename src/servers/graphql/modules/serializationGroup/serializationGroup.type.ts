/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const SerializationGroupTypedefs = gql`
  type SerializationGroup {
    _id: String
    batchNo: Int
    maxItems: Int
    link: String
    status: String
    description: String
    createdAt: GDate
    updatedAt: GDate
  }
  type SerializationGroupRowData {
    action: String
    batch: Int
    description: String
    maxItems: Int
    serializationGroupId: String
  }
  type getMyCSVforBatchOutput {
    serializationGroup: SerializationGroup
  }
  type SerializationGroupData {
    columnDefs: [ColumnDefs]
    rowData: [SerializationGroupRowData]
  }
  type SerializationGroupTableOutput {
    count: Int
    data: SerializationGroupData
    limit: Int
    sort: String
  }
  input createSerializationGroupInput {
    maxItems: Int
    description: String
  }
  extend type Query {
    serializationGroupTable(
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
    getSerializationGroups: [SerializationGroup]
    getMyCSVforBatch(serializationGroupId: String!): getMyCSVforBatchOutput
  }
  extend type Mutation {
    createSerializationGroup(
      data: createSerializationGroupInput!
    ): SerializationGroup
    retryCSVUpload(serializationGroupId: String!): SerializationGroup
  }
`;
