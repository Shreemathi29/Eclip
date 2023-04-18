/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {NetworkGraphResolver} from './network-graph.resolver';
import {networkGraphTypeDefs} from './network-graph.type';

export const NetworkGraphModule = createModule({
  id: 'network-graph-module',
  dirname: __dirname,
  typeDefs: [networkGraphTypeDefs],
  resolvers: [NetworkGraphResolver],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
