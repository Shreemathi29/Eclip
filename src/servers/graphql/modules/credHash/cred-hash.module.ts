/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {gqlCommonResolvers, gqlCommonTypeDefs} from '../gql-common.module';
import {CredHashResolver} from './cred-hash.resolver';
import {CredHashTypedefs} from './cred-hash.type';

export const CredHashModule = createModule({
  id: 'credHash-module',
  dirname: __dirname,
  typeDefs: [CredHashTypedefs, gqlCommonTypeDefs],
  resolvers: [CredHashResolver, gqlCommonResolvers],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
