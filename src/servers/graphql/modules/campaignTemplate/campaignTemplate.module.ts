/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {CampaignTemplateResolver} from './campaignTemplate.resolver';
import {CampaignTemplateTypedefs} from './campaignTemplate.type';

export const campaignTemplateModule = createModule({
  id: 'campaign-template-module',
  dirname: __dirname,
  typeDefs: [CampaignTemplateTypedefs],
  resolvers: [CampaignTemplateResolver],
});
