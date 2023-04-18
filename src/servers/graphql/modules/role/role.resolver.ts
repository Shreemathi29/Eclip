/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RoleCommonService} from '@/common/modules/role/role.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const RoleResolver = {
  Query: {
    async getRoles(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(RoleCommonService),
      ) as RoleCommonService;
      return serv.getRoles();
    },
    async getRolePermissionMeta(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(RoleCommonService),
      ) as RoleCommonService;
      return serv.getRolePermissionMeta(args);
    },
    async getMyRole(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(RoleCommonService),
      ) as RoleCommonService;
      return serv.getMyRole(args);
    },
  },
  Mutation: {
    async createRole(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(RoleCommonService),
      ) as RoleCommonService;
      return serv.createRole(args);
    },
    // async addPermissions(root: any, args: any, ctx: GqlCtx) {
    //   const serv = ctx.reqCtx.getSync(
    //     getServiceName(RoleCommonService),
    //   ) as RoleCommonService;
    //   return serv.addPermissions(args);
    // },
    // async removePermissions(root: any, args: any, ctx: GqlCtx) {
    //   const serv = ctx.reqCtx.getSync(
    //     getServiceName(RoleCommonService),
    //   ) as RoleCommonService;
    //   return serv.removePermissions(args);
    // },
    async updatePermissions(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(RoleCommonService),
      ) as RoleCommonService;
      return serv.updatePermissions(args);
    },
  },
};
