/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const VPRTypeDefs = gql`
  extend type Mutation {
    createVPR(
      bundleId: String!
      emails: [String!]!
      webhook: String
      nonce: String
      claims: [ClaimInput]
    ): String
  }

  input ClaimInput {
    reason: String!
    claimType: String
    claimValue: String
    credentialType: String
    essential: Boolean!
    issuers: [IssuerInput]
  }

  input IssuerInput {
    id: String
    url: String
  }
`;
