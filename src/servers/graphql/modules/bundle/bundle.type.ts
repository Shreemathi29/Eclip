/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const BundleTypeDefs = gql`
  extend type Query {
    getMyBundles(input: GetMyBundlesInput): GetMyBundleOutput
    getConsentMethods: GetConsentMethodsOutput
  }

  extend type Mutation {
    createBundle(data: BundleInput!): Bundle
    attachBundle(client_id: String!, bundleIds: [String!]!): String
  }

  type GetConsentMethodsOutput {
    consent_methods: [String]
  }

  input BundleInput {
    title: String!
    description: String!
    credentials: [BundleCredentialsInput]
    consent_methods: [String]
  }

  input BundleCredentialsInput {
    credential_id: String
    name: String
    logo: String
    claims: [String]
  }
  input GetMyBundlesInput {
    skip: Int
    limit: Int
  }
  type Bundle {
    _id: String
    bundle_id: String
    description: String
    title: String
    credentials: [BundleCredential]
    consent_methods: [String]
  }
  type GetMyBundleOutput {
    data: [Bundle]
    current_page: Int
    page_size: Int
    total_count: Int
    total_pages: Int
  }

  type BundleCredential {
    credential_id: String
    name: String
    logo: String
    claims: [String]
  }
`;
