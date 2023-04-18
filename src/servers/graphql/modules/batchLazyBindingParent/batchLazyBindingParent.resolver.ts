/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {BatchLazyBindingParentCommonService} from '@/common/modules/batchLazyBindingParent/batchLazyBindingParent.common.service';
import {ProductHelper} from '@/common/modules/products/product.helper';
import {VarientsHelper} from '@/common/modules/variants/varients.helper';
import {getServiceName} from '@/utils/loopbackUtils';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

export const BatchLazyBindingParentResolver = {
  Mutation: {
    async createBatchLazyBindingParent(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchLazyBindingParentCommonService),
      ) as BatchLazyBindingParentCommonService;
      return serv.createBatchLazyBindingParent();
    },
    async associateBatchLazyBindingParentWithProduct(
      root: any,
      args: any,
      ctx: GqlCtx,
    ) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchLazyBindingParentCommonService),
      ) as BatchLazyBindingParentCommonService;
      return serv.associateBatchLazyBindingParentWithProduct(args);
    },
  },
  Query: {
    async getBatchLazyBindingParent(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchLazyBindingParentCommonService),
      ) as BatchLazyBindingParentCommonService;
      return serv.getBatchLazyBindingParent(args.batchLazyBindingParentId);
    },
  },
  BatchLazyBindingParent: {
    product: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualProd = root?.product;
      if (actualProd && mongoose.isValidObjectId(actualProd)) {
        const productHelper = new ProductHelper();
        const product = await ctx.dataLoaders
          ?.getProductDataLoader()
          ?.load(actualProd);
        return productHelper.getProductResponse(product);
      }
      return null;
    },
    gtin: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualVariant = root?.gtin;
      if (actualVariant && mongoose.isValidObjectId(actualVariant)) {
        const variantHelper = new VarientsHelper();
        const variant = await ctx.dataLoaders
          ?.getGtinDataLoader()
          ?.load(actualVariant);
        return variantHelper.getVarientResponse(variant);
      }
      return null;
    },
    batch: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualBatch = root?.batch;
      if (actualBatch && mongoose.isValidObjectId(actualBatch)) {
        const batch = await ctx.dataLoaders
          ?.getBatchDataLoader()
          ?.load(actualBatch);
        return batch;
      }
      return null;
    },
  },
};
