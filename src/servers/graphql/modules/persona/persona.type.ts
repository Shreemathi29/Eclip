/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const PersonaTypedefs = gql`
  extend type Query {
    getPersonas: [Persona]
  }
  extend type Mutation {
    updateSDRPersonaTx(
      sdrPersonatxId: ID!
      data: UpdateSDRPersonaTxInput!
    ): SDRPersonaTx
    createPersona(name: String!, users: [PersonaUsersInput]!): Persona
    addUsersToPersona(personaId: ID!, users: [PersonaUsersInput]!): Persona
    removeUsersFromPersona(
      personaId: ID!
      users: [PersonaRemoveUsersInput]!
    ): Persona
  }

  input UpdateSDRPersonaTxInput {
    removeCredTempIds: [ID!]
    upserts: [SDRPersonaTxUpsertsInput!]
  }

  input SDRPersonaTxUpsertsInput {
    credTempId: ID
    allKeysEnabled: Boolean
    allowedKeys: [String!]
  }

  input PersonaUsersInput {
    name: String!
    email: String!
  }

  input PersonaRemoveUsersInput {
    _id: ID!
    name: String!
    email: String!
  }

  type Persona {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    name: String
    sdrPersonaTx: SDRPersonaTx
    sdr: ID
    users: [PersonaUsers]
  }
  type PersonaUsers {
    name: String
    email: String
  }

  type SDRPersonaTx {
    _id: ID
    createdAt: GDate
    updatedAt: GDate
    claims: [PersonaClaim]
    allCredClaims: [AllCredClaims]
  }
  type AllCredClaims {
    claim: PersonaClaim
    isTemplateEnabled: Boolean
  }
  type PersonaClaim {
    credentialTemplate: TemplateStyle
    allowedKeys: [String]
    allKeysEnabled: Boolean
    allKeys: [AllKeys]
  }

  type AllKeys {
    key: String
    isEnabled: Boolean
  }
`;
