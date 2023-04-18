/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RestServiceDiscoveryService} from '@/servers/rest/services';
import {log} from '@/utils';
import {Application, CoreBindings, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {getService} from '@loopback/service-proxy';
import {GRPCServiceConfig} from './grpc-connect.component';
import {GrpcDataSource} from './grpc.datasource';

export class GRPCConnectFactoryService<T> {
  public dataSource: GrpcDataSource;
  private service: Promise<T> | null;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    private cnfg: GRPCServiceConfig,
    private grpcServiceName: string,
  ) {
    // if (!this.cnfg?.grpcPort && !this.cnfg?.grpcServiceDiscoveryName)
    //   throw new Error(
    //     `grpc port configuration not provided for ${this.grpcServiceName} service`,
    //   );
  }
  async getService() {
    if (!this.service) {
      await this.connect();
    }
    if (!this.service)
      throw new HttpErrors.InternalServerError(
        `grpc service not connected ${this.grpcServiceName}`,
      );
    return this.service;
  }

  async connect() {
    if (!this.cnfg?.grpcServiceDiscoveryName) {
      const datasource = await this.getDatasource(
        this.cnfg?.grpcPort as string,
      );
      this.service = getService<T>(datasource);
      return this.service;
    } else {
      const url = await this.getSDService().getServiceInst(
        this.cnfg?.grpcServiceDiscoveryName,
      );
      if (!url) {
        this.service = null;
        log.error(
          `CRITICAL: Unable to resolve url from consul for ${this.grpcServiceName} for name: ${this.cnfg?.grpcServiceDiscoveryName}`,
        );
        return this.service;
      } else {
        const datasource = await this.getDatasource(url as string);
        this.service = getService<T>(datasource);
        return this.service;
      }
    }
  }

  private async getDatasource(url: string) {
    this.dataSource = new GrpcDataSource({
      spec: this.cnfg.protoPath,
      name: this.grpcServiceName,
      connector: 'loopback-connector-grpc',
      url,
    });
    log.info(`datasource acquired url ${url} for ${this.grpcServiceName}`);
    return this.dataSource;
  }

  private getSDService() {
    // eslint-disable-next-line no-useless-catch
    try {
      return this.app.getSync(
        'services.RestServiceDiscoveryService',
      ) as RestServiceDiscoveryService;
    } catch (err) {
      throw err;
      // return this.app.getSync(
      //   'services.GraphqlServiceDiscoveryService',
      // ) as GraphqlServiceDiscoveryService;
    }
  }
}
