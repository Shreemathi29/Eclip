/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {CredHashCommonService} from '@/common/modules/credHash/credHash.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const CredHashResolver = {
  Query: {
    async getProvsForCredHash(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CredHashCommonService),
      ) as CredHashCommonService;
      const ret = await serv.getProvsForCredHash(args);
      return ret;
    },
  },
};
