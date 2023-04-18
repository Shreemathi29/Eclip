/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const Credential = gql`
  extend type Query {
    getCredentialTemplates(input: Pagination!): [CredentialTemplate]
    verifyCredential(tag: String!): VerifyCredentialOutput
    getCredentialStatus(tag: String!): getCredentialOutput
  }

  extend type Mutation {
    updateCredentialAndIssue(_id: ID!, data: UpdateCredDataInput!): String

    issueCredential(
      credentialContent: [KeyVal]
      email: String!
      credentialTemplateId: String!
      sendEmail: Boolean
      sendPN: Boolean
    ): String

    sendEmailAndPN(
      tag: String!
      email: String!
      sendEmail: Boolean!
      sendPN: Boolean!
    ): String

    updateCredentialStatus(
      tag: String!
      status: String!
      reason: String!
    ): CredentialStatusClaim
  }

  input UpdateCredDataInput {
    evidences: [String!]
    images: [String!]
    keyvals: [KeyVal!]
    geoJSON: String
  }

  type getCredentialOutput {
    statusClaims: [CredentialStatusClaim]
  }
  type VerifyCredentialOutput {
    keyvals: [KeyValOutput]
  }
  type KeyValOutput {
    key: String
    value: String
    label: String
    copyText: Boolean
    link: String
    display: Boolean
    type: String
  }

  input KeyVal {
    key: String!
    value: String!
  }

  input Pagination {
    skip: Int
    limit: Int
  }
  type CredentialTemplate {
    id: String
    name: String
    logo: String
    description: String
    template: [template]
    fields: JSON
  }
  type template {
    label: String
    name: String
    type: String
    fieldProps: JSON
    isMandatory: Boolean
    value: String
  }

  type CredentialStatusClaim {
    id: String
    currentStatus: String
    statusReason: String
    issued: String
  }
`;
