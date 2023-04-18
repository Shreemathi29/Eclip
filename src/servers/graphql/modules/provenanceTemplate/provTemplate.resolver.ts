/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {ProvTemplateCommonService} from '@/common/modules/provenanceTemplate/provenanceTemplate.common.service';
import {getServiceName} from '@/utils/loopbackUtils';
import {GqlCtx} from '../../graphql.component';

export const ProvTemplateResolver = {
  Query: {
    async getProvTemplates(root: any, args: any, ctx: GqlCtx) {
      const serv = ctx.reqCtx.getSync(
        getServiceName(ProvTemplateCommonService),
      ) as ProvTemplateCommonService;
      return await serv.getProvTemplates();
    },
  },
};
