/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {BundleResolver} from './bundle.resolver';
import {BundleTypeDefs} from './bundle.type';

export const BundleModule = createModule({
  id: 'bundle-module',
  dirname: __dirname,
  typeDefs: [BundleTypeDefs],
  resolvers: [BundleResolver],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IApplicationType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
