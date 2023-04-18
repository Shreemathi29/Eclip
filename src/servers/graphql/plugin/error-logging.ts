/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {log} from '@/utils';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContextDidEncounterErrors,
} from 'apollo-server-plugin-base';

export const errorPlugin: ApolloServerPlugin = {
  async requestDidStart(
    requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>,
  ) {
    return {
      async didEncounterErrors(reqCtx) {
        const error = reqCtx.errors?.[0];
        log.error(`${reqCtx.operationName}:${error?.message}`);
      },
    };
  },
};
