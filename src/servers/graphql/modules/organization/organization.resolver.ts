/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {OrganizationService} from '@/domain-services/organization.service';
import {GqlCtx} from '../../graphql.component';

export const OrganizationResolver = {
  Query: {
    async getMyOrganization(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        'services.OrganizationService',
      ) as OrganizationService;

      // const orgid = ctx.currentUser?.organization;

      const org = await serv.getMyOrg();
      return org;
    },
  },
  Mutation: {
    async editMyOrganization(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        'services.OrganizationService',
      ) as OrganizationService;
      const org = await serv.getMyOrg();
      return serv.editOrganization(org._id, args.input);
    },
  },
};
