/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VApplication} from '@/application';
import {inject} from '@loopback/context';
import {Component, CoreBindings, LifeCycleObserver} from '@loopback/core';
import {chalkReportKey, chalkReportValue} from '@utils/chalkColors';
import {EnvModule} from '@utils/EnvModule';
import {fillTemplate} from '@utils/fillTemplate';
import {log} from '@utils/logging';
// import {
//   GrpcObject,
//   loadPackageDefinition,
//   Server,
//   ServerCredentials,
//   ServiceDefinition,
// } from 'grpc';
import path from 'path';
import {GRPCRingLevelMessageHandlerService} from './handlers/ring-level-handlers';
import {PingerGRPCProvider} from './providers';
import {GRPCProviderComponent} from './providers/grpc-provider.component';
import {GRPCHealthService, GRPCServiceDiscoveryService} from './services';

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');
const pkg = require('../../../package.json');
const PROTO_PATH = path.join(__dirname, './protos/vlinder-login.proto');

const is = require('is_js');

const env = EnvModule?.getInstance()?.getEnv();

export class GRPCAPIComponent implements Component, LifeCycleObserver {
  status = 'not-initialized';
  initialized = false;
  private name = 'GRPC-SERVER';
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication,
  ) {
    this.setupBindings();

    //------------->>>>>--------------//
    //Components
    this.app.component(GRPCProviderComponent);
    //------------->>>>>--------------//

    //------------->>>>>--------------//
    //Services
    this.app.service(GRPCHealthService);
    this.app.service(GRPCServiceDiscoveryService);
    this.app.service(GRPCRingLevelMessageHandlerService);
    //------------->>>>>--------------//
  }
  async init() {
    await this.initRunLevel();
    this.status = 'initialized';
    this.initialized = true;
    await this.report();
  }

  async start() {
    log.info(`GRPC component started`);
    this.status = 'started';

    log.info(
      ` \n ==================== GRPC server started on port: ${
        this.app?.getServerConfig('grpc')?.port
      } ======================== \n`,
    );
  }

  async stop() {
    this.status = 'stopped';
  }

  setupBindings() {
    //------------->>>>>--------------//
    const sd = env?.SERVICE_DISCOVERY;
    const apiPort = this.app?.getServerConfig('grpc')?.port;
    const APP_NAME = env?.APP_NAME;
    const MODIFIED_APP_NAME = 'dc-${dc}-' + APP_NAME + '-server-${server}';
    const _appName = fillTemplate(MODIFIED_APP_NAME, {
      dc: env.DATA_CENTER,
      version: pkg.version,
      instance: env.INSTANCE,
      server: 'GRPC',
    });
    const _serviceDiscoveryOptions: any = {
      serviceName: _appName,
      heartBeatInSecs: sd.heartbeat,
      port: apiPort,
      host: env?.HOST,
      tags: [`${_appName}-${pkg.version}-i${env.INSTANCE}`],
    };

    if (defaultConfig.service.check) {
      _serviceDiscoveryOptions.check = {
        name: `${_appName} Service health status check`,
        ttl: sd?.ttl,
        deregister_critical_service_after: sd?.deregister,
        notes: `${_appName} ${defaultConfig.service.check.notes}`,
      };
    }
    if (defaultConfig.service.watchers) {
      _serviceDiscoveryOptions.serviceWatcher = defaultConfig.service.watchers;
    }
    this.app
      .configure('services.GRPCServiceDiscoveryService')
      .to(_serviceDiscoveryOptions);
  }

  async initRunLevel() {
    const ringLevelMessageHandler = this.getRingLevelMessageHandler();
    await ringLevelMessageHandler.handleMessage({});
    // await this.grpcMain(`0.0.0.0:${this.app?.getServerConfig('grpc')?.port}`);
  }

  // loadGrpcService() {
  //   const packageDefinition = loadSync(PROTO_PATH, {
  //     keepCase: true,
  //     longs: String,
  //     enums: String,
  //     defaults: true,
  //     oneofs: true,
  //   });
  //   const pkg = loadPackageDefinition(packageDefinition);
  //   const VlinderLogin = (pkg.vlinderLogin as GrpcObject)
  //     .VlinderLogin as GrpcObject;
  //   return {VlinderLogin};
  // }

  // async grpcMain(port = '0.0.0.0:51001') {
  //   const grpcServer = await this.createGrpcServer(port);
  //   const apiPort = this.app?.getServerConfig('grpc')?.port;
  //   const APP_NAME = env?.APP_NAME;
  //   const MODIFIED_APP_NAME =
  //     'dc-${dc}-' + APP_NAME + '-server-${server}-i${instance}';
  //   grpcServer.start();
  //   log.info(`${MODIFIED_APP_NAME} is running at ${apiPort}`);
  //   return grpcServer;
  // }

  // async createGrpcServer(port = '0.0.0.0:51001') {
  //   const server = new Server();
  //   const {VlinderLogin} = this.loadGrpcService();

  //   const methods = this.getGrpcProvider();

  //   server.addService(
  //     VlinderLogin.service as ServiceDefinition<unknown>,
  //     methods,
  //   );

  //   server.bind(port, ServerCredentials.createInsecure());
  //   return server;
  // }

  getGrpcProvider() {
    return this.app.getSync(
      'GRPCProviderComponent.PingerGRPCProvider',
    ) as PingerGRPCProvider;
  }

  async report() {
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
    log.info(chalkReportValue(this.name + ` Component Report`));
    log.info(chalkReportKey('⦿ Server:' + chalkReportValue('GRPC')));
    log.info(
      chalkReportKey(
        '⦿ Port:' + chalkReportValue(this.app?.getServerConfig('grpc')?.port),
      ),
    );
    log.info(
      chalkReportKey(
        '⦿ Service Discovery:' +
          chalkReportValue(env?.SERVICE_DISCOVERY?.enable),
      ),
    );
    log.info(
      chalkReportKey('⦿ logz Server:' + chalkReportValue(env?.LOGGER?.enable)),
    );
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
  }

  getRingLevelMessageHandler() {
    return this.app.getSync(
      'services.GRPCRingLevelMessageHandlerService',
    ) as GRPCRingLevelMessageHandlerService;
  }
}
