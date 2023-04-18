/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {AnalyticsCommonService} from '@/common/modules/analytics/analytics.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const AnalyticsResolver = {
  Query: {
    async getAnalytics(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(AnalyticsCommonService),
      )) as AnalyticsCommonService;
      return serv.getAnalytics();
    },

    async refreshAnalytics(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(AnalyticsCommonService),
      )) as AnalyticsCommonService;
      return serv.refresh();
    },
  },
};
