/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {DashboardTableCommonService} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const DashboardTableResolver = {
  Query: {
    async userTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getUserTable(args);
      return ret;
    },
    async holderTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getHolderTable(args);
      return ret;
    },
    async credentialTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getCredentialTable(args);
      return ret;
    },
    async presentationTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getPresentationTable(args);
      return ret;
    },

    async personaTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getPersonaTable(args);
      return ret;
    },

    async batchLazyBindingParentTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getBatchLazyBindingParentTable(args);
      return ret;
    },

    async sapTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getSapTable(args);
      return ret;
    },

    async masterDispatchTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getMasterDispatchTable(args);
      return ret;
    },

    async dispatchTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getDispatchTable(args);
      return ret;
    },

    async reportTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getReportTable(args);
      return ret;
    },

    async getTNTDump(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const ret = await serv.getTNTDump(args);
      return ret;
    },
  },
};
