/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {inject} from '@loopback/core';
import {Context} from 'vm';
import {ProvenanceTemplate} from './provenanceTemplate.model';

export class ProvTemplateCommonService extends RequestCtxAbs {
  constructor(@inject.context() protected ctx: Context) {
    super(ctx);
  }
  @authAndAuthZ('read', 'ProvTemplates')
  async getProvTemplates() {
    const provTemplateRes = await ProvenanceTemplate.find();
    console.log(provTemplateRes);

    return provTemplateRes;
  }
}
