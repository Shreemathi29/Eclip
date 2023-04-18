/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const BatchTypedefs = gql`
  type Batch {
    _id: ID
    name: String
    description: String
    manufactureDate: GDate
    variants: [String]
    product: Product
    creatorUser: String
    isLocked: Boolean
    promoVideoUrl: String
    promoWebsiteUrl: String
    promoButtonText1: String
    promoButtonText2: String
    batchLazyBindingParent: BatchLazyBindingParent
    shelfLife: GDate
    createdAt: GDate
    updatedAt: GDate
  }
  type Batches {
    data: [Batch]
    count: Int
    sort: String
    sortOrder: SortOrder
    limit: Int
    skip: Int
  }
  input filterBatchBy {
    name: String
    startDate: GDate
    endDate: GDate
  }
  input UpdateBatchInput {
    description: String
    isLocked: Boolean
    validFrom: String
    validUntil: String
    promoVideoUrl: String
    promoWebsiteUrl: String
    promoButtonText1: String
    promoButtonText2: String
  }
  input CreateBatchWhere {
    productId: ID!
  }
  input CreateBatchInput {
    name: String!
    description: String
    variants: [ID]
    manufactureDate: GDate
    shelfLife: GDate
    isLocked: Boolean
  }
  input getBatchesForGtinInput {
    gtinKey: String!
  }
  type getBatchesForGtinOutput {
    batchId: ID
    batchNo: String
    mfgDate: GDate
    gtinKey: String
    hash: String
    tagsFused: Int
  }
  type getBatchesForGtinRes {
    data: [getBatchesForGtinOutput]
    count: Int
    sort: String
    sortOrder: String
    limit: Int
    skip: Int
  }
  type createNFCHashForBatchOutput {
    hash: String
    uid: String
    env: String
    serialIdentifier: ID
  }
  extend type Query {
    getBatch(batchId: String!): Batch
    findBatches(
      criteria: filterBatchBy
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): Batches
    getBatchesForGtin(
      criteria: getBatchesForGtinInput
      skip: Int
      limit: Int
      sort: String
      sortOrder: SortOrder
    ): getBatchesForGtinRes
  }
  extend type Mutation {
    createBatch(where: CreateBatchWhere!, data: CreateBatchInput!): Batch
    updateBatch(batchId: String!, data: UpdateBatchInput!): Batch
    uploadBatches(file: String!): String
    createNFCHashForBatch(
      batchId: ID!
      macId: String!
      latitude: Int
      longitude: Int
      env: String
    ): createNFCHashForBatchOutput
    updateNFCountForBatch(
      serialIdentifier: ID!
      batchId: ID!
      gtinId: ID!
      uid: String
      latitude: Int
      longitude: Int
      env: String
      ip: String
      hash: String
      interfaceType: String
      isSuccess: Boolean
      failureMessage: String
      appMode: String
      NFCTagType: String
    ): JSON
  }
`;
