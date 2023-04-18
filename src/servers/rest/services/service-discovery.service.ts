/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
//@ts-nocheck
import {log, pretty} from '@/utils/logging';
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
export class RestServiceDiscoveryService {
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

  async getServiceInst(serviceName: string) {
    // this.consulService.register();
    // console.log('this.consulService', this.consulService);
    console.log('serviceName', serviceName);
    const x: ServiceReply | null =
      this.consulService.getSpecificServiceInstance(serviceName);
    log.info(`getConsulServiceInst ${serviceName}==> ${pretty(x)}`);
    const fullAddress = x?.address && x?.port && x?.address + ':' + x?.port;
    return fullAddress;
  }
}
