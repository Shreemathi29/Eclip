/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const User = gql`
  extend type Query {
    getHolders(skip: Int!, limit: Int!): [Holder]
    getMyself: User
  }
  input inviteUserInput {
    email: String!
    givenName: String!
    familyName: String!
    role: ID!
  }
  extend type Mutation {
    inviteHolder(user: createUserInput!, sendInvitationEmail: Boolean): String
    inviteUserByAdmin(user: inviteUserInput!): String
    resendAdminInvitation(email: String): String
    createCoreUser(
      user: createUserInput!
      sendInvitationEmail: Boolean
      roleId: String!
    ): User

    editUser(
      email: String!
      familyName: String
      givenName: String
      telephone: String
      image: String
      roleId: String
      accessForbidden: Boolean
    ): User

    editMyself(
      familyName: String
      givenName: String
      telephone: String
      image: String
    ): User
    # inviteHolder(email: String!): String
  }

  input createUserInput {
    email: String!
    givenName: String
    familyName: String
    # tags: [String]
    image: String
  }

  type User {
    email: String
    givenName: String
    familyName: String
    fullName: String
    emailVerified: Boolean
    isRegistered: Boolean
    isInviEmailSent: Boolean
    role: Role
    accessForbidden: Boolean
    # TODO: Add brand Ref
  }

  type Holder {
    email: String
    givenName: String
    familyName: String
    image: String
    isRegistered: Boolean
  }
`;
