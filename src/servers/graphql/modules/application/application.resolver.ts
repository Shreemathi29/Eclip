/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ApplicationService} from '@/common/modules/application/application.service';
import {BundleCommonService} from '@/common/modules/bundle/bundle.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import _ from 'lodash';
import {GqlCtx} from '../../graphql.component';

export const ApplicationResolver = {
  Query: {
    async getApplications(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.getApplications(args.offset, args.limit);
    },
    async getApplication(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.getApplication(args);
    },
    async getApiApplication(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.getApiApplication();
    },
  },

  Mutation: {
    async createApplication(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.createAppplication(args.input);
    },
    async enableApplication(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.enableApplication(args.client_id);
    },
    async editApplication(root: any, args: any, ctx: GqlCtx) {
      const serv = (await ctx.reqCtx.get(
        'services.ApplicationService',
      )) as ApplicationService;
      return serv.editApplication(args);
    },
  },

  Application: {
    async bundles(root: any, args: any, ctx: GqlCtx) {
      if (Array.isArray(root.bundles) && !_.isEmpty(root.bundles)) {
        const serv = (await ctx.reqCtx.get(
          getServiceName(BundleCommonService),
        )) as BundleCommonService;
        const bundles = await serv.getBundlesById({_ids: root.bundles});
        return bundles;
      } else {
        return [];
      }
    },
  },
};
