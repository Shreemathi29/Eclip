/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RestClientConfig, RestClientService} from '@/clients/rest/rest.client';
import {bind, BindingScope, config} from '@loopback/context';
import {catchAxiosError} from './interceptor';

@bind({scope: BindingScope.SINGLETON})
export class CredentialFormClient {
  constructor(
    @config() private credFormSerbConfig: RestClientConfig,
    private restClient = new RestClientService(credFormSerbConfig.httpTimeout),
  ) {}

  //credential-template

  @catchAxiosError
  async getFormInfoByCid(cid: string) {
    const ret = await this.restClient.get(this.getFullUrl(`?cid=${cid}`));
    return ret.data;
  }

  // ------------------------------------private----------------------------------

  private getFullUrl(route: string) {
    const baseURL = this.credFormSerbConfig.baseUrl;
    return baseURL + route;
  }
}
