/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {DashboardTableCommonService} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {SerializationGroupCommonService} from '@/common/modules/serializationGroup';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const SerializationGroupResolver = {
  Query: {
    async serializationGroupTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      return await serv.serializationGroupTable(args);
    },
    async getSerializationGroups(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(SerializationGroupCommonService),
      ) as SerializationGroupCommonService;
      return await serv.getSerializationGroups();
    },
    async getMyCSVforBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(SerializationGroupCommonService),
      ) as SerializationGroupCommonService;
      return await serv.getMyCSVforBatch(args);
    },
  },
  Mutation: {
    async createSerializationGroup(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(SerializationGroupCommonService),
      ) as SerializationGroupCommonService;
      return await serv.createSerializationGroup(args);
    },
    async retryCSVUpload(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(SerializationGroupCommonService),
      ) as SerializationGroupCommonService;
      return await serv.retryCSVUpload(args);
    },
  },
};
