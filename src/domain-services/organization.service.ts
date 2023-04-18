/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {authAndAuthZ} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, inject, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {AssetCatalogueModuleService} from '@vlinder-be/asset-catalogue-module/dist/module/services/module.service';
import {Context} from 'vm';

@bind({scope: BindingScope.SINGLETON})
export class OrganizationService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(AssetCatalogueModuleService)
    private assetCatalogueService: AssetCatalogueModuleService,
  ) {
    super(ctx);
  }

  @authAndAuthZ('read', 'Organization')
  async getOrganizationByID(id: string) {
    const org = await this.assetCatalogueService.brand.findOne({_id: id});
    if (!org) {
      throw new HttpErrors.NotFound(`user organization not found id:${id}`);
    }
    return org;
  }

  @authAndAuthZ('read', 'Organization')
  async getOrganizationByDID(did: string) {
    const org = await this.assetCatalogueService.brand.findOne({did});
    if (!org) {
      throw new HttpErrors.NotFound(`user organization not found id:${did}`);
    }
    return org;
  }

  @authAndAuthZ('update', 'Organization')
  async editOrganization(id: string, args: any) {
    const org = await this.assetCatalogueService.brand.findByIdAndEdit(
      id,
      args,
    );
    if (!org) {
      throw new HttpErrors.NotFound(`user organization not found id:${id}`);
    }
    return org;
  }

  async getMyOrg() {
    return this.getIssuerOrg();
  }

  async getIssuerOrg() {
    const org = await this.assetCatalogueService.brand.findOne({});
    if (!org) {
      throw new HttpErrors.NotFound(`organization not found `);
    }
    return org;
  }
}
