/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {IUser} from '@common/modules/users/user.model';
import {bind, BindingScope, config} from '@loopback/core';
import axios, {AxiosInstance} from 'axios';
import {catchAxiosError} from './interceptor';
const is = require('is_js');

export interface WalletClientConfig {
  baseUrl: string;
}

export interface HolderFromDIDOrEmail extends IUser {
  wallet?: any;
  pushTokens?: PushToken[];
}

export interface PushToken {
  token: string;
  device_type: string;
  provider: string;
  createdAt: Date;
}

export interface Org {
  name: string;
  webhook_url: string;
  emails: string[];
  did: string;
}

export interface Filter {
  to?: string;
  tag?: string;
  status?: string;
}

export interface Sort {
  by: string;
  order: string;
}

export interface Query {
  filter: Filter;
  skip: number;
  limit: number;
  sort?: Sort;
}

export interface CredentialToRegister {
  from: string;
  to: string;
  tag: string;
  valid_from: string;
  valid_until?: string;
  issuer_bkup: string;
  holder_bkup: string;
  status: string;
}

export interface WalletUser extends IUser {
  did: string;
  provider: string;
  pk: string;
  push_tokens: PushToken[];
}

@bind({scope: BindingScope.SINGLETON})
export class WalletClient {
  private client: AxiosInstance;
  constructor(@config() private walletConfig: WalletClientConfig) {
    // TODO: remove this hard coded url before merge
    this.client = axios.create({
      baseURL: this.walletConfig.baseUrl,
      timeout: 30000, // 30 secs
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  @catchAxiosError
  async registerOrg(org: Org) {
    const response = await this.client.post(`/org/register`, org);
    return response?.data?.org;
  }

  @catchAxiosError
  async subscribeUsers({did, emails}: Pick<Org, 'did' | 'emails'>) {
    const response = await this.client.post(`/org/subscribe`, {
      client_id: did,
      emails,
    });
    return response?.data?.org;
  }

  @catchAxiosError
  async unSubscribeUsers({did, emails}: Pick<Org, 'did' | 'emails'>) {
    const response = await this.client.post(`/org/unsubscribe`, {
      client_id: did,
      emails,
    });
    return response?.data?.org;
  }

  @catchAxiosError
  async getUserProfile({did, email}: {did: string; email: string}) {
    const response = await this.client.post(`/org/user-profile`, {
      client_id: did,
      email,
    });

    return response?.data;
  }

  @catchAxiosError
  async getHolders({
    did,
    skip,
    limit,
  }: {
    did: string;
    skip: number;
    limit: number;
  }) {
    const response = await this.client.post(`/org/get-holders`, {
      client_id: did,
      skip,
      limit,
    });

    return response?.data.holders;
  }

  @catchAxiosError
  async getUsersByEmailOrDID({
    entries,
    includePushTokens,
    client_id,
    includeAllWallets,
  }: {
    entries: string[];
    includePushTokens?: boolean;
    client_id: string;
    includeAllWallets?: boolean;
  }) {
    const new_entries = entries.filter(x => !!x);
    const response = await this.client.post(`/org/get-users-by-email-or-did`, {
      entries: new_entries,
      includePushTokens,
      includeAllWallets,
      client_id,
    });
    return response?.data?.users;
  }
  @catchAxiosError
  async registerCredential({
    did,
    credential,
  }: {
    did: string;
    credential: CredentialToRegister;
  }) {
    const response = await this.client.post(`/org/credential/register`, {
      client_id: did,
      credential,
    });

    return response?.data;
  }
}
