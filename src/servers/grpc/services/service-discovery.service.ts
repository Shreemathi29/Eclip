/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
//@ts-nocheck
import {bind, /* inject, */ BindingScope, config} from '@loopback/core';
import {ConsulService} from '@vlinder-be/consul-service-node';

export interface IServiceDiscoveryOptions {
  serviceName: string;
  port?: number;
  host?: string;
  heartBeatInSecs: number;
  serviceWatcher?: any;
  check?: any;
  tags?: any[];
}

@bind({scope: BindingScope.SINGLETON})
export class GRPCServiceDiscoveryService {
  private consulService: ConsulService;
  constructor(@config() private options: IServiceDiscoveryOptions) {
    this.consulService = new ConsulService(this.options);
  }

  async init() {
    await this.register();
  }

  async register() {
    await this.consulService.register();
  }
}
