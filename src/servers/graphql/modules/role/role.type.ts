/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {gql} from 'graphql-modules';

export const RoleTypedefs = gql`
  extend type Query {
    getRoles: [Role]
    getRolePermissionMeta: GetRolePermissionMeta
    getMyRole: Role
  }

  extend type Mutation {
    createRole(
      name: String!
      permissions: [RolePermissionInput!]
      FENavItems: [String!]
    ): Role
    # addPermissions(role: String!, permissions: [RolePermissionInput!]): Role
    # removePermissions(role: String!, permissions: [RolePermissionInput!]): Role
    updatePermissions(role: String!, permissions: [RolePermissionInput!]): Role
  }

  input RolePermissionInput {
    subject: String!
    action: String!
    fields: [String!]
    inverted: Boolean
  }

  type Role {
    _id: ID
    name: String
    permissions: [RolePermission]
    FENavItems: [JSON]
  }

  type RolePermission {
    subject: String
    action: String
    inverted: Boolean
    fields: [String!]
  }

  type GetRolePermissionMeta {
    subjects: [String]
    actions: [String]
  }
`;
