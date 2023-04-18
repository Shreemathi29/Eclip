/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {gqlCommonResolvers, gqlCommonTypeDefs} from '../gql-common.module';
import {DashboardTableResolver} from './dashboard-table.resolver';
import {DashboardTableTypedefs} from './dashboard-table.type';

export const DashboardTableModule = createModule({
  id: 'dashboard-table-module',
  dirname: __dirname,
  typeDefs: [DashboardTableTypedefs, gqlCommonTypeDefs],
  resolvers: [DashboardTableResolver, gqlCommonResolvers],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       authenticate(),
  //       // authorizeCustom([IUserType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
