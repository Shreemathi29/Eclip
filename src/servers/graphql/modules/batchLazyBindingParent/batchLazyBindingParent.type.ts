/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const BatchLazyBindingParentTypedefs = gql`
  type BatchLazyBindingParent {
    _id: ID
    description: String
    dateKey: String
    counterRef: String
    parentId: String
    hash: String
    urlEncodedHash: String
    createdBy: String
    creatorRole: String
    creatorType: String
    createdAt: GDate
    updatedAt: GDate
    batch: Batch
    product: Product
    gtin: Gtin
  }

  input associate {
    productId: ID!
    gtinId: ID!
    batchId: ID!
  }

  extend type Mutation {
    createBatchLazyBindingParent: BatchLazyBindingParent
    associateBatchLazyBindingParentWithProduct(
      batchLazyBindingParentId: ID!
      associate: associate!
    ): BatchLazyBindingParent
  }

  extend type Query {
    getBatchLazyBindingParent(
      batchLazyBindingParentId: ID!
    ): BatchLazyBindingParent
  }
`;
