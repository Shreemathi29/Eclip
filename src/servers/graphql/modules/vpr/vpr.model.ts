/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {createModule} from 'graphql-modules';
import {VPRResolver} from './vpr.resolver';
import {VPRTypeDefs} from './vpr.types';

export const VPRModule = createModule({
  id: 'vpr-module',
  dirname: __dirname,
  typeDefs: [VPRTypeDefs],
  resolvers: [VPRResolver],

  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
