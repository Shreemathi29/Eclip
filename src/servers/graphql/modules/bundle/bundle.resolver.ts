/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {BundleCommonService} from '@/common/modules/bundle/bundle.common.service';
import {getServiceName} from '@/utils/loopbackUtils';

export const BundleResolver = {
  Query: {
    async getMyBundles(root: any, args: any, ctx: any) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(BundleCommonService),
      )) as BundleCommonService;
      return serv.getMyBundles(args.input);
    },

    async getConsentMethods(root: any, args: any, ctx: any) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(BundleCommonService),
      )) as BundleCommonService;
      return serv.getConsentMethods(args.input);
    },
  },

  Mutation: {
    async createBundle(root: any, args: any, ctx: any) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(BundleCommonService),
      )) as BundleCommonService;
      return serv.createBundle(args.where, args.data);
    },

    async attachBundle(root: any, args: any, ctx: any) {
      const serv = (await ctx.reqCtx.get(
        getServiceName(BundleCommonService),
      )) as BundleCommonService;
      return serv.attachBundle(args);
    },
  },
};
