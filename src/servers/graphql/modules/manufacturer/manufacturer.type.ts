/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {gql} from 'graphql-modules';

export const ManufacturerTypedefs = gql`
  enum BrandType {
    organization
    person
  }
  enum OrgType {
    network
    sub
  }
  type SocialLink {
    type: String
    url: String
  }
  type BrandAddress {
    addressLine1: String
    addressLine2: String
    city: String
    state: String
    zipcode: String
    country: String
  }
  type Brand {
    _id: ID
    telephone: String
    name: String
    description: String
    nameKey: String
    email: String
    sameAs: String
    address: BrandAddress
    fullAddress: String
    creator: String
    logo: String
    type: BrandType
    orgType: OrgType
    did: String
    pk: String
    identityProviderType: String
    website: String
    socialLinks: [SocialLink]
  }
  extend type Query {
    getNetworkOperatorOrganization: Brand
  }
`;
