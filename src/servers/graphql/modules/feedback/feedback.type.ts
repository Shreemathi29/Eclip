/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const FeedbackTypedefs = gql`
  type FeedbackTableRowData {
    _id: String
    batch: String
    comments: String
    date: GDate
    email: String
    gtinKey: String
    location: String
    name: String
    product: String
    rating: Int
  }
  type FeedbackTableData {
    columnDefs: [ColumnDefs]
    rowData: [FeedbackTableRowData]
  }
  type FeedbackTableOutput {
    count: Int
    data: FeedbackTableData
    limit: Int
  }
  input details {
    key: String!
    value: String!
  }
  input filterByForFeedbackTable {
    name: String
    email: String
    product: String
    batch: String
    rating: Int
    startDate: GDate
    endDate: GDate
    download: Boolean
    details: details
  }
  extend type Query {
    feedbackTable(
      criteria: filterByForFeedbackTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
  }
`;
