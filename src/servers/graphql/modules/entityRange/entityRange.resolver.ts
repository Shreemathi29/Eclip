/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {DashboardTableCommonService} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {EntityRangeCommonService} from '@/common/modules/entityRange/entityRange.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const EntityRangeResolver = {
  Query: {
    async entityRangeTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      return await serv.entityRangeTable(args);
    },
  },
  Mutation: {
    async createEntityRange(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(EntityRangeCommonService),
      ) as EntityRangeCommonService;
      return await serv.createEntityRange(args);
    },
  },
};
