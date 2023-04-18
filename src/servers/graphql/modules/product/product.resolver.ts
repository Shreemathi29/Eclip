/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {ProductCommonService} from '@/common/modules/products/products.common.service';
import {VarientsHelper} from '@/common/modules/variants/varients.helper';
import {DLRefs} from '@/servers/graphql/dataLoaders/dataLoaders';
import {getServiceName} from '@/utils/loopbackUtils';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

export const ProductResolver = {
  Query: {
    async getProducts(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProductCommonService),
      ) as ProductCommonService;
      return serv.getProducts(args);
    },
    async getProduct(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProductCommonService),
      ) as ProductCommonService;
      return serv.getProduct(args.productId);
    },
  },

  Mutation: {
    async createProduct(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProductCommonService),
      ) as ProductCommonService;
      return serv.createProduct(args);
    },
    async updateProduct(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProductCommonService),
      ) as ProductCommonService;
      return serv.updateProduct(args);
    },
    async uploadProducts(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProductCommonService),
      ) as ProductCommonService;
      return await serv.uploadProducts(args);
    },
  },
  Product: {
    gtins: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualId = root?._id;
      if (actualId && mongoose.isValidObjectId(actualId)) {
        const gtinRefs = (await ctx.dataLoaders
          ?.getGtinIdsViaProductDL()
          ?.load(actualId)) as DLRefs;
        if (gtinRefs?.arrData?.length > 0) {
          const gtinHelper = new VarientsHelper();
          const gtins = await ctx.dataLoaders
            ?.getGtinDataLoader()
            ?.loadMany(gtinRefs.arrData.map(x => x?._id))!;
          return gtins.map(gtin => gtinHelper.getVarientResponse(gtin));
        }
      }

      return [];
    },
    brand: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualOrg = root?.brand;
      if (actualOrg && mongoose.isValidObjectId(actualOrg)) {
        return ctx.dataLoaders?.getOrgDataLoader()?.load(actualOrg);
      }
      return null;
    },
  },
};
