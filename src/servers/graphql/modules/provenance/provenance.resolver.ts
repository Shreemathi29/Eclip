/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {DashboardTableCommonService} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {ProductHelper} from '@/common/modules/products/product.helper';
import {ProvenanceCommonService} from '@/common/modules/provenance';
import {getServiceName} from '@/utils/loopbackUtils';
import mongoose from 'mongoose';
import {GqlCtx} from '../../graphql.component';

export const ProvenanceResolver = {
  Query: {
    async provenanceTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      const p = await serv.provenanceTable(args);
      return p;
    },
    async getProvenance(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.getProvenance(args.provenanceId);
    },
    async checkProvForDefaultBatch(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.checkProvForDefaultBatch(args.gtin);
    },
  },
  Mutation: {
    async issueProvCredential(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.issueProvCredential(args);
    },
    async createProvenance(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.createProvenanceFromProvTemp(args);
    },
    async updateProvenance(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.updateProvenance(args);
    },
    async uploadFile(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvenanceCommonService),
      ) as ProvenanceCommonService;
      return await serv.uploadFile(args);
    },
  },
  Provenance: {
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
    batch: async (root: any, args: any, ctx: GqlCtx, info: any) => {
      const actualBatch = root?.batch;
      if (actualBatch && mongoose.isValidObjectId(actualBatch)) {
        return ctx.dataLoaders?.getBatchDataLoader()?.load(actualBatch);
      }
      return null;
    },
  },
};
