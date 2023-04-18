/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {HolderCommonService} from '@/common/modules/holder/holder.common.service';
import {Role} from '@/common/modules/role/role.model';
import {UserCommonService} from '@/common/modules/users/user.common.service';
import {UserProfile} from '@/common/modules/users/user.model';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const UserResolver = {
  Query: {
    async getHolders(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(HolderCommonService),
      ) as HolderCommonService;
      return serv.getHolders(args);
    },

    async getMyself(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;

      return serv.getMyself();
    },
  },

  Mutation: {
    // @injectGQLReqCtx
    async createCoreUser(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;

      return serv.createCoreUser({
        currentUser: ctx.currentUser as UserProfile,
        roleId: args.roleId,
        userProps: args.user,
        sendInvitationEmail: args.sendInvitationEmail,
      });
    },
    async editUser(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;

      return serv.editUser(args);
    },
    async editMyself(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;

      return serv.editMyself(args);
    },

    async inviteHolder(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(HolderCommonService),
      ) as HolderCommonService;
      return serv.inviteHolder({
        userProps: args.user,
        sendInvitationEmail: args.sendInvitationEmail,
      });
    },
    async inviteUserByAdmin(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;
      return serv.inviteUserByAdmin(args.user);
    },
    async resendAdminInvitation(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(UserCommonService),
      ) as UserCommonService;

      return serv.resendAdminInvitation(args.email);
    },
  },

  User: {
    async role(root: any, args: any, ctx: GqlCtx) {
      const roleId = root.role;
      const role = await Role.findOne({_id: roleId});
      return role;
    },
  },
};
