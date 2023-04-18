/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {catchAxiosError} from '@/clients/rest/interceptor';
import {RestClientConfig, RestClientService} from '@/clients/rest/rest.client';
import {bind, BindingScope, config} from '@loopback/context';

interface E2cakEncryptParams {
  /** EncryptParams org */
  org: string;

  /** EncryptParams tokenGroup */
  tokenGroup?: string | null;

  /** EncryptParams tokenId */
  tokenId?: string | null;

  /** EncryptParams gtin */
  gtin?: string | null;

  /** EncryptParams batch */
  batch?: string | null;

  /** EncryptParams variant */
  variant?: string | null;

  /** EncryptParams serial */
  serial?: string | null;

  /** EncryptParams QRBatch */
  QRBatch?: string | null;

  /** EncryptParams QRBatch */
  shortDate?: string | null;

  /** EncryptParams QRBatch */
  parentId?: string | null;

  /** EncryptParams QRSerial */
  QRSerial?: string | null;

  /** EncryptParams productBatch */
  productBatch?: string | null;
}

@bind({scope: BindingScope.SINGLETON})
export class CAKClient {
  constructor(
    @config() private cakClienConfig: RestClientConfig,
    private restClient = new RestClientService(cakClienConfig.httpTimeout),
  ) {}

  //credential-template

  //input brand external id

  @catchAxiosError
  async e2Cak({
    name,
    params,
    type,
    uid,
  }: {
    name: string;
    params: E2cakEncryptParams;
    type: string;
    uid?: string | null;
  }) {
    const response = await this.restClient.post(this.getFullUrl(`/cak/e2cak`), {
      name,
      params,
      type,
      uid,
    });
    return response?.data;
  }

  @catchAxiosError
  async d2Cak({hash, name, type}: {name: string; hash: string; type: string}) {
    const response = await this.restClient.post(this.getFullUrl(`/cak/d2cak`), {
      hash,
      name,
      type,
    });
    return response.data;
  }
  @catchAxiosError
  async e2cak_serial_no_bulk({
    name,
    params,
    serialNoStart,
    serialNoEnd,
    type,
  }: {
    name: string;
    params: any;
    serialNoStart: number;
    serialNoEnd: number;
    type: string;
  }) {
    const response = await this.restClient.post(
      this.getFullUrl(`/cak/e2cak-serial-no-bulk`),
      {
        name,
        params,
        serialNoStart,
        serialNoEnd,
        type,
      },
    );
    return response.data;
  }

  // ------------------------------------private----------------------------------

  private getFullUrl(route: string) {
    const baseURL = this.cakClienConfig.baseUrl;
    return baseURL + route;
  }
}
