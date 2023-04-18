/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CampaignCommonService} from '@/common/modules/campaign/campaign.common.service';
import {DashboardTableCommonService} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const CampaignResolver = {
  Query: {
    async campaignTable(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(DashboardTableCommonService),
      ) as DashboardTableCommonService;
      return serv.campaignTable(args);
    },
    async getCampaign(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.getCampaign(args);
    },
  },
  Mutation: {
    async createCampaign(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.createCampaign(args);
    },
    async editCampaign(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.editCampaign(args);
    },
    async duplicateCampaign(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.duplicateCampaign(args);
    },
    async associateProductsToCampaign(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.associateProductsToCampaign(args);
    },
    async editCampaignStatus(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.editCampaignStatus(args);
    },
    async removeCampaignProduct(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignCommonService),
      ) as CampaignCommonService;
      return serv.removeCampaignProduct(args);
    },
  },
};
