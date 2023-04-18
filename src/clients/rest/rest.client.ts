/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, config} from '@loopback/core';
import {log, pretty} from '@utils/logging';
import axios from 'axios';
const is = require('is_js');

const DEFAULT_TIMEOUT = 10000;
export interface RestClientConfig {
  baseUrl: string;
  httpTimeout?: number;
  [key: string]: any;
}
@bind({scope: BindingScope.SINGLETON})
export class RestClientService {
  readonly get = axios.get;
  readonly put = axios.put;
  readonly post = axios.post;
  readonly delete = axios.delete;

  constructor(@config() private httpTimeout?: number) {
    //@ts-ignore
    axios.interceptors.response.use(null, error => {
      const expectedError =
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500;

      if (!expectedError) {
        log.error(`http service error : ${pretty(error)}`);
      }
      return Promise.reject(error);
    });

    axios.defaults.timeout = this.httpTimeout ?? DEFAULT_TIMEOUT;
  }

  setHeader(key: string, value: string) {
    axios.defaults.headers.common[key] = value;
  }
}
