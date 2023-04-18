/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const DashboardTableTypedefs = gql`
  extend type Query {
    userTable(
      criteria: filterByForUserTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    holderTable(skip: Int, limit: Int): TableOutput
    credentialTable(skip: Int, limit: Int): TableOutput
    presentationTable(skip: Int, limit: Int): TableOutput
    personaTable(
      skip: Int
      limit: Int
      criteria: PersonaTableCriteriaInput!
    ): TableOutput
    batchLazyBindingParentTable(
      criteria: filterByForBatchLazyBindingParentTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    sapTable(
      criteria: filterByForSapTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    masterDispatchTable(
      criteria: filterByForMasterDispatchTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    dispatchTable(
      criteria: filterByForDispatchTable!
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    reportTable(
      criteria: filterByForReportTable
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): TableOutput
    getTNTDump(thtDumpId: String!): JSON
  }

  input filterByForSapTable {
    startDate: GDate
    endDate: GDate
    unit: String
    product: String
    gtin: String
    batch: String
    fileName: String
    status: String
    download: Boolean
  }

  input filterByForMasterDispatchTable {
    startDate: GDate
    endDate: GDate
    dispatchDate: String
    fileName: String
    status: String
    download: Boolean
  }

  input filterByForDispatchTable {
    masterDispatchId: ID!
    startDate: GDate
    endDate: GDate
    status: String
    sapCode: String
    materialGroup: String
    groupDescription: String
    materialGroup4: String
    packsize: String
    plant: String
    batchno: String
    exciseBatchNumber: String
    mfgdate: String
    download: Boolean
  }

  input filterByForUserTable {
    givenName: String
    familyName: String
    email: String
    role: String
    status: String
    download: Boolean
  }

  input filterByForBatchLazyBindingParentTable {
    startDate: GDate
    endDate: GDate
    download: Boolean
    createdBy: String
    product: String
    batch: String
  }

  input filterByForReportTable {
    endDate: GDate
    startDate: GDate
    tableName: String
    status: String
    download: Boolean
  }

  input PersonaTableCriteriaInput {
    personaId: ID!
    name: String
    email: String
  }

  type TableOutput {
    currentPage: Int
    pageSize: Int
    totalCount: Int
    totalPages: Int
    data: JSON
  }
`;
