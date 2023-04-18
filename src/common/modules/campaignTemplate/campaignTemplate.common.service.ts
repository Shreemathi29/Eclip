/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {inject} from '@loopback/core';
import {Context} from 'vm';
import {CampaignTemplate} from './campaignTemplate.model';

export class CampaignTemplateCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }
  @authAndAuthZ('read', 'Campaign')
  async getCampaignTemplates() {
    const campaignTemplateRes = await CampaignTemplate.find();
    return campaignTemplateRes;
  }
}
