/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const Orgnaization = gql`
  extend type Query {
    getMyOrganization: Organization
  }
  type Mutation {
    editMyOrganization(input: EditOrganizationInput): Organization
  }
  type Organization {
    _id: String
    sameAs: String
    telephone: String
    description: String
    name: String
    email: String
    creator: String
    address: Address
    fullAddress: String
    logo: String
    createdAt: String
    updatedAt: GDate
    OrgType: String
    socialLinks: [SocialLinksOutput]
  }
  type Address {
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    zipcode: String
    country: String
  }
  input AddressInput {
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    zipcode: String
    country: String
  }
  input SocialLinksInput {
    type: String!
    url: String!
  }
  type SocialLinksOutput {
    type: String!
    url: String!
  }
  input EditOrganizationInput {
    sameAs: String
    telephone: String
    address: AddressInput
    logo: String
    socialLinks: [SocialLinksInput]
    email: String
  }
`;
