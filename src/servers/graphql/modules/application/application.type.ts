/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const Application = gql`
  extend type Mutation {
    createApplication(input: CreateApplicationInput!): Application
    enableApplication(client_id: String): String
    editApplication(
      applicationId: String!
      input: EditApplicationInput!
    ): Application
  }
  extend type Query {
    getApplications(offset: Int, limit: Int): [Application]
    getApplication(_id: ID!): Application
    getApiApplication: Application
  }

  type Application {
    _id: ID
    name: String
    client_id: String
    bundles: [Bundle]
    description: String
    app_logo: String
    app_link: String
    home_page_link: String
    privacy_policy_link: String
    TAndC_link: String
    callback_url: String
    secret_key: String
    created_at: GDate
    updated_at: GDate
  }
  input CreateApplicationInput {
    name: String!
    description: String
    app_link: String
    app_logo: String
    TAndC_link: String
    callback_url: String
    privacy_policy_link: String
    home_page_link: String
  }

  input EditApplicationInput {
    description: String
    app_logo: String
    appLink: String
    home_page_link: String
    privacy_policy_link: String
    TAndC_link: String
    callback_url: String
  }
`;
