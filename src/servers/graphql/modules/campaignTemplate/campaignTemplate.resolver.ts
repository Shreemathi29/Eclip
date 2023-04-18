/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {CampaignTemplateCommonService} from '@/common/modules/campaignTemplate/campaignTemplate.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const CampaignTemplateResolver = {
  Query: {
    async getCampaignTemplates(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(CampaignTemplateCommonService),
      ) as CampaignTemplateCommonService;
      return serv.getCampaignTemplates();
    },
  },
};
