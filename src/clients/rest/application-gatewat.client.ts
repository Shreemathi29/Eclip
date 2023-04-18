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
export class ApplicationGatewayClient {
  constructor(
    @config() private clientConfig: RestClientConfig,
    private client = new RestClientService(clientConfig.httpTimeout),
  ) {}

  @catchAxiosError
  async addEmailLookup(params: {email: string; org: string}) {
    const response = await this.client.post(
      this.getFullUrl(`/create/email_lookup`),
      params,
    );
    return response?.data;
  }

  @catchAxiosError
  async addGtinLookup(params: {gtin: string; org: string}) {
    const response = await this.client.post(
      this.getFullUrl(`/create/gtin_lookup`),
      params,
    );
    return response?.data;
  }

  @catchAxiosError
  async getTrinetraOCRInfo(params: {content: string; type: string}) {
    try {
      const response = await this.client.post(
        this.getFullUrl(`/trinetra/trinetr/`),
        params,
      );
      return response?.data;
    } catch (err) {
      return {};
    }
  }

  // -------------------------Private-------------------------------
  private getFullUrl(route: string) {
    return this.clientConfig.baseUrl + route;
  }
}
