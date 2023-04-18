/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {BatchCommonService} from '@/common/modules/batch';
import {ProductHelper} from '@/common/modules/products/product.helper';
import {getServiceName} from '@/utils/loopbackUtils';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

export const BatchResolver = {
  Query: {
    async findBatches(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.findBatches(args);
    },
    async getBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.getBatch({batch_id: args.batchId});
    },
    async getBatchesForGtin(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.getBatches(args);
    },
  },
  Mutation: {
    async createBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.createBatch(args);
    },
    async updateBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.updateBatch({batch_id: args.batchId, data: args.data});
    },
    async uploadBatches(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.uploadBatches(args);
    },
    async createNFCHashForBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.createNFCHashForBatch(args);
    },
    async updateNFCountForBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(BatchCommonService),
      ) as BatchCommonService;
      return serv.updateNFCountForBatch(args);
    },
  },
  Batch: {
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
