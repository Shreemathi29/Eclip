/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, config} from '@loopback/core';
import {catchAxiosError} from './interceptor';
import {RestClientConfig, RestClientService} from './rest.client';

export declare type TSupportedStragies = 'SES' | 'sendGrid';

@bind({scope: BindingScope.SINGLETON})
export class KlefkiLoginClient {
  constructor(
    @config() private clientConfig: RestClientConfig,
    private client = new RestClientService(clientConfig.httpTimeout),
  ) {}

  @catchAxiosError
  async generateEmailVerifyToken(params: {owner: string}) {
    const response = await this.client.post(
      this.getFullUrl(`/internal/auth/email_verifiy_token/get`),
      params,
    );
    return response?.data;
  }

  // -------------------------Private-------------------------------
  private getFullUrl(route: string) {
    return this.clientConfig.baseUrl + route;
  }
}
