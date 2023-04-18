/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {RoleTypedefs} from '../role/role.type';
import {UserResolver} from './user.resolver';
import {User} from './user.type';

export const UserModule = createModule({
  id: 'user-module',
  dirname: __dirname,
  typeDefs: [User, RoleTypedefs],
  resolvers: [UserResolver],

  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
