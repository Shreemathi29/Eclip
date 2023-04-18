/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const TOSTypedefs = gql`
  input TOSCreateInput {
    gtin: String
    action: TAndCType!
    service_agreement: String!
    email: String
  }
  input TOS {
    type: TAndCType
    agreementUrl: String
  }
  type AcceptanceOutput {
    accepted: Boolean
    type: TAndCType
    email: String
  }
  type TOSLog {
    _id: String
    gtin: String
    action: String
    service_agreement: String
    email: String
    user_agent: JSON
    acceptance_date: GDate
    createdAt: GDate
    updatedAt: GDate
  }
  type TOSCreateOutput {
    tos_log: TOSLog
  }
  enum TAndCType {
    user_registration
    age_verification
    client_login
    admin_web_app_login
  }
  extend type Query {
    isTAndCAccepted(input: TOS): AcceptanceOutput
  }

  extend type Mutation {
    acceptTAndC(input: TOS): AcceptanceOutput
    createTOS(input: TOSCreateInput): TOSCreateOutput
  }
`;
