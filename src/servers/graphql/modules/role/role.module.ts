/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {RoleResolver} from './role.resolver';
import {RoleTypedefs} from './role.type';

export const RoleModule = createModule({
  id: 'role-module',
  dirname: __dirname,
  typeDefs: [RoleTypedefs],
  resolvers: [RoleResolver],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
