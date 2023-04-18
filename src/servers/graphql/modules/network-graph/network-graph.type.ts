/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const networkGraphTypeDefs = gql`
  extend type Query {
    getMyGraph(query: FindEdgesQuery): Graph
  }

  input FindEdgesQuery {
    criteria: CredentialQueryCriteriaInput
    limit: Int
    skip: Int
    # sort: CredentialSortBy
    sortOrder: SortOrder
  }

  input CredentialQueryCriteriaInput {
    type: CredentialType
  }

  type Graph {
    id: String
    graphs: GraphData
    actualEdgecount: Float
    currentPage: Float
    pageSize: Float
    totalCount: Float
    totalPages: Float
  }

  type GraphData {
    nodes: [NodeData]
    edges: [EdgeData]
    nodeDetails: [NodeDetails]
  }

  type NodeDetails {
    id: String
    details: [KeyValData]
    image: String
    title: String
  }
  type EdgeData {
    from: String
    to: String
    id: String
    label: String
  }

  type NodeData {
    nodeType: String
    edgeTag: String
    id: String
    title: String
    image: String
    size: Float
    fullName: String
    email: String
    vidTooltip: String
    toDID: String
    fromDID: String
    # details: [KeyValData]
  }

  type KeyValData {
    key: String
    value: String
  }

  enum CredentialType {
    SDR
    VerifiableCredential
    VerifiablePresentation
  }

  # enum CredentialSortBy {
  #   _id
  #   createdAt
  #   updatedAt
  #   iat
  #   exp
  # }
`;
