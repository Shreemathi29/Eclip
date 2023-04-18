/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {TableInput} from '@/common/modules/dashboardTable/dashboardTable.common.service';
import {bind, BindingScope, config} from '@loopback/core';
import {catchAxiosError} from './interceptor';
import {RestClientConfig, RestClientService} from './rest.client';

export declare type TSupportedStragies = 'SES' | 'sendGrid';

@bind({scope: BindingScope.SINGLETON})
export class SapClient {
  constructor(
    @config() private clientConfig: RestClientConfig,
    private client = new RestClientService(clientConfig.httpTimeout),
  ) {}

  @catchAxiosError
  async listProvDump(reqBody: TableInput) {
    const response = await this.client.post(
      this.getFullUrl(`/list/provDump`),
      reqBody,
    );
    return response.data;
  }

  @catchAxiosError
  async listMasterDispatch(reqBody: TableInput) {
    const response = await this.client.post(
      this.getFullUrl(`/list/masterDispatch`),
      reqBody,
    );
    return response.data;
  }

  @catchAxiosError
  async listDispatch(reqBody: TableInput) {
    const response = await this.client.post(
      this.getFullUrl(`/list/dispatch`),
      reqBody,
    );
    return response.data;
  }

  @catchAxiosError
  async getTntDump(reqData: {thtDumpId: string}) {
    const response = await this.client.post(
      this.getFullUrl(`/provDump/get`),
      reqData,
    );
    return response.data;
  }

  @catchAxiosError
  async getProvDumpCallsPerDay() {
    const response = await this.client.post(
      this.getFullUrl(`/analytics/perDay`),
      {},
    );
    return response.data;
  }

  @catchAxiosError
  async getDispatchCallsPerDay() {
    const response = await this.client.post(
      this.getFullUrl(`/analytics/dispatch/perDay`),
      {},
    );
    return response.data;
  }

  @catchAxiosError
  async getDispatchObjPerDay() {
    const response = await this.client.post(
      this.getFullUrl(`/analytics/dispatchObj/perDay`),
      {},
    );
    return response.data;
  }

  // -------------------------Private-------------------------------
  private getFullUrl(route: string) {
    return this.clientConfig.baseUrl + route;
  }
}
