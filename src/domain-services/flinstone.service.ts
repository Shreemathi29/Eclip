/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {FlinstoneClient} from '@/clients/rest/flinstone.client';
import {authenticateMethod} from '@/common/request-context/authenticate.interceptor';
import {RequestCtxAbs} from '@/common/request-context/request-ctx-abs';
import {bind, BindingScope, Context, inject} from '@loopback/context';
import {service} from '@loopback/core';

@bind({scope: BindingScope.SINGLETON})
export class FlinstoneService extends RequestCtxAbs {
  constructor(
    @inject.context() protected ctx: Context,
    @service(FlinstoneClient)
    private flinstoneClient: FlinstoneClient,
  ) {
    super(ctx);
  }

  @authenticateMethod
  async getCredentialTemplates({
    skip = 0,
    limit = 100,
  }: {
    skip: number;
    limit: number;
  }) {
    return this.flinstoneClient.getCredentialTemplates({skip, limit});
  }
}
