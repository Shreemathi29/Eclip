/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {NetworkGraphCommonService} from '@/common/modules/networkGraph/network-graph.service';

export const NetworkGraphResolver = {
  Query: {
    async getMyGraph(root: any, args: any, ctx: any) {
      console.debug('getMyGraph args', args);
      const serv = ctx.reqCtx.getSync(
        'services.NetworkGraphCommonService',
      ) as NetworkGraphCommonService;
      return serv.getMyGraph(args);
    },
  },
};
