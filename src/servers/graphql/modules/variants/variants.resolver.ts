/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ProductHelper} from '@/common/modules/products/product.helper';
import {VariantCommonService} from '@/common/modules/variants/variants.common.service';
import {DLRefs} from '@/servers/graphql/dataLoaders/dataLoaders';
import {getServiceName} from '@/utils/loopbackUtils';
import _ from 'lodash';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

export const VariantResolver = {
  Query: {
    async getGtin(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return serv.getVariant(args.gtin_id);
    },
    async getGtinsByProductID(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return await serv.getGtinsByProductID(args.where);
    },
    async findGtins(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return serv.findVariants(args);
    },
  },
  Mutation: {
    async createGtin(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return await serv.createVariant(args);
    },
    async updateGtin(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return await serv.updateVariant(args);
    },
    async uploadGtins(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return await serv.uploadVariants(args);
    },
    async issueGtinCredential(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(VariantCommonService),
      ) as VariantCommonService;
      return await serv.issueGtinCredential(args.gtinKey);
    },
  },
  Gtin: {
    batches: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualId = root?._id;
      if (actualId && mongoose.isValidObjectId(actualId)) {
        const gtinRefs = (await ctx.dataLoaders
          ?.getBatchIdsViaGtinDL()
          ?.load(actualId)) as DLRefs;
        if (gtinRefs?.arrData?.length > 0) {
          const uniqIds = _.uniq(gtinRefs.arrData.map(x => x?._id));
          return ctx.dataLoaders?.getBatchDataLoader()?.loadMany(uniqIds);
        }
      }

      return [];
    },
    product: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualProd = root?.item;
      if (actualProd && mongoose.isValidObjectId(actualProd)) {
        const productHelper = new ProductHelper();
        const product = await ctx.dataLoaders
          ?.getProductDataLoader()
          ?.load(actualProd);
        return productHelper.getProductResponse(product);
      }
      return null;
    },
  },
};
