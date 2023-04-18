/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
/* eslint-disable @typescript-eslint/camelcase */

import {ks1} from '@/../compiled';
import {BindingKey, inject} from '@loopback/context';
import {
  Application,
  Component,
  CoreBindings,
  LifeCycleObserver,
} from '@loopback/core';
import {GRPCConnectFactoryService} from './grpc-connect.factory.service';
export interface GRPCServiceConfig {
  grpcPort?: string;
  grpcServiceDiscoveryName?: string;
  protoPath: string;
}

export class GRPCConnectComponent implements Component, LifeCycleObserver {
  status = 'not-initialized';
  initialized = false;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {
    this.setupBindings();
  }
  async init() {
    this.status = 'initialized';
    this.initialized = true;
  }

  async start() {
    this.status = 'started';
  }

  async stop() {
    this.status = 'stopped';
  }

  setupBindings() {}
  // ------------------------------------------------------------------------------
  // private getConfig(param: (string | undefined)[]) {
  //   const config: GRPCServiceConfig = {
  //     grpcPort: param[0],
  //     grpcServiceDiscoveryName: param[1],
  //     protoPath: path.resolve(__dirname, param[2] as string),
  //   };
  //   return config;
  // }
}

export const ks1KeyString = 'ks1-decoder-grpc';
export const KS1_DECODER_KEY =
  BindingKey.create<GRPCConnectFactoryService<ks1.KS1Service>>(ks1KeyString);

export type KS1_DECODER_SERVICE = GRPCConnectFactoryService<ks1.KS1Service>;
