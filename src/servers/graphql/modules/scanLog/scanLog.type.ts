/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const ScanLogTypeDefs = gql`
  type ScanLog {
    batch: String
    batchId: String
    city: String
    country: String
    device: String
    email: String
    gtin: String
    gtinId: String
    interface: String
    product: String
    productId: String
    state: String
    status: String
    time: GDate
  }
  type CompProps {
    editable: Boolean
    field: String
    headerName: String
    minWidth: Int
  }
  type Color {
    color: String
  }
  type TypeProps {
    title: String
    message: String
    comp: JSON
    button: JSON
    footer: JSON
    buttonStyle: JSON
    titleStyle: JSON
    value: String
    type: String
  }
  type ColumnDefs {
    compProps: CompProps
    type: String
    valueStyle: Color
    typeProps: [TypeProps]
  }
  type ScanLogData {
    columnDefs: [ColumnDefs]
    rowData: [ScanLog]
  }
  type ScanLogTableOutput {
    count: Int
    data: ScanLogData
    sort: String
  }
  input ScanLogCriteria {
    onlyBrandProtectionValid: Boolean
    product: String
    batch: String
    email: String
    endDate: GDate
    startDate: GDate
    device: String
    interface: String
    city: String
    purpose_nin: [String]
    state: String
    country: String
    status: String
    download: Boolean
  }
  extend type Query {
    scanLogTable(
      criteria: ScanLogCriteria
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): JSON
  }
`;
