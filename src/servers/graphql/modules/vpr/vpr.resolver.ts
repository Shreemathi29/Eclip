/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {VPRService} from '@/domain-services/vpr/vpr.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const VPRResolver = {
  Mutation: {
    // @injectGQLReqCtx
    async createVPR(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(getServiceName(VPRService)) as VPRService;
      return serv.createVPR(args);
    },
  },
};
