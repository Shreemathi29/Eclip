/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, config} from '@loopback/core';
import {catchAxiosError} from './interceptor';
import {RestClientConfig, RestClientService} from './rest.client';

export interface TMailerData {
  name: TSupportedStragies;
  data: EmailParam;
  uid: string;
  retry?: number;
  statusWebhookUrl?: string;
  nonce?: string;
}

export declare type EmailParam = {
  from: string;
  to: string[] | string;
  cc?: string[];
  bcc?: string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    content: any;
    filename: string;
    contenttype?: string;
    encoding?: string;
  }[];
};

export interface TPushNotificationData {
  name: 'expo' | 'firebase';
  data: [Message];
  uid: string;
  retry?: number;
  statusWebhookUrl?: string;
  nonce?: string;
}

interface Message {
  to: string | string[];
  body?: string;
  priority?: 'normal' | 'high';
  badge?: number;
  subtitle?: string;
  title?: string;
  sound?: string;
  expiration?: number;
  data?: {
    [key: string]: string;
  };
  tags?: Object;
}

export declare type TSupportedStragies = 'SES' | 'sendGrid';

@bind({scope: BindingScope.SINGLETON})
export class PowerpuffClient {
  constructor(
    @config() private clientConfig: RestClientConfig,
    private client = new RestClientService(clientConfig.httpTimeout),
  ) {}

  @catchAxiosError
  async mailNow(req: TMailerData) {
    const response = await this.client.post(this.getFullUrl(`/mail/now`), req);
    return response?.data;
  }

  @catchAxiosError
  async pushNotificationNow(req: any) {
    const response = await this.client.post(
      this.getFullUrl(`/push-notification/now`),
      req,
    );
    return response?.data;
  }
  private getFullUrl(route: string) {
    return this.clientConfig.baseUrl + route;
  }
}
