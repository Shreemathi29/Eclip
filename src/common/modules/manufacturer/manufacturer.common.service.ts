/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {OrganizationService} from '@/domain-services/organization.service';
import {inject} from '@loopback/core';
import {Context} from 'vm';
import {ManufacturerHelper} from './manufacturer.helper';

export class ManufacturerCommonService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @inject('services.OrganizationService')
    private orgService: OrganizationService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Manufacturer')
  public async getManufacturer() {
    const org = await this.orgService.getMyOrg();
    const mfHelper = new ManufacturerHelper();
    return mfHelper.getManufacturerRes(org);
  }
}
