/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
/* eslint-disable @typescript-eslint/camelcase */

import {VApplication} from '@/application';
import {UserProfile} from '@/common/modules/users/user.model';
import {CommonRequestContext} from '@/common/request-context/request-context';
import {DataLoaderGetter} from '@/servers/graphql/dataLoaders/dataLoaders';
import {inject} from '@loopback/context';
import {Component, CoreBindings, LifeCycleObserver} from '@loopback/core';
import {chalkReportKey, chalkReportValue} from '@utils/chalkColors';
import {EnvModule} from '@utils/EnvModule';
import {fillTemplate} from '@utils/fillTemplate';
import {log} from '@utils/logging';
import {ApolloServer} from 'apollo-server';
import {ExpressContext} from 'apollo-server-express';
import {applyMiddleware} from 'graphql-middleware';
import {createApplication} from 'graphql-modules';
import 'reflect-metadata';
//@ts-ignore
import requestIp from 'request-ip';
import {Context} from 'vm';
import {formatError} from '../custom.error.msg';
import {GraphqlRingLevelMessageHandlerService} from './handlers/ring-level-handlers';
import {
  // errorHandlerMiddleware,
  GqlRequestLogging,
  TraceLogging,
} from './middleware';
import {HelloModule} from './modules';
import {AnalyticsModule} from './modules/analytics/analytics.module';
import {ApplicationModule} from './modules/application/application.module';
import {BatchModule} from './modules/batch/batch.module';
import {BatchLazyBindingParentModule} from './modules/batchLazyBindingParent/batchLazyBindingParent.module';
import {BundleModule} from './modules/bundle/bundle.module';
import {CampaignModule} from './modules/campaign/campaign.module';
import {campaignTemplateModule} from './modules/campaignTemplate/campaignTemplate.module';
import {CredentialModule} from './modules/credential/credential.module';
import {CredHashModule} from './modules/credHash/cred-hash.module';
import {DashboardTableModule} from './modules/dashboard-table/dashboard-table.module';
import {EntityRangeModule} from './modules/entityRange/entityRange.module';
import {FeedbackModule} from './modules/feedback/feedback.module';
import {ManufacturerModule} from './modules/manufacturer/manufacturer.module';
import {NetworkGraphModule} from './modules/network-graph/network-graph.module';
import {OrgnaizationModule} from './modules/organization/organization.module';
import {PersonaModule} from './modules/persona/persona.module';
import {ProductModule} from './modules/product/product.module';
import {ProvenanceModule} from './modules/provenance/provenance.module';
import {ProvTemplateModule} from './modules/provenanceTemplate/provTemplate.module';
import {RoleModule} from './modules/role/role.module';
import {ScanLogModule} from './modules/scanLog/scanLog.module';
import {SerializationGroupModule} from './modules/serializationGroup/serializationGroup.module';
import {TOSModule} from './modules/tos/tos.module';
import {UserModule} from './modules/user/user.module';
import {VariantModule} from './modules/variants/variants.module';
import {VPRModule} from './modules/vpr/vpr.model';
import {errorPlugin} from './plugin/error-logging';
import {GraphqlHealthService, GraphqlServiceDiscoveryService} from './services';

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');
const pkg = require('../../../package.json');

const env = EnvModule?.getInstance()?.getEnv();

const MODULES = [
  HelloModule,
  OrgnaizationModule,
  UserModule,
  CredentialModule,
  DashboardTableModule,
  BundleModule,
  RoleModule,
  NetworkGraphModule,
  ApplicationModule,
  VPRModule,
  AnalyticsModule,
  ProductModule,
  ManufacturerModule,
  VariantModule,
  BatchModule,
  ProvenanceModule,
  ProvTemplateModule,
  campaignTemplateModule,
  ScanLogModule,
  CampaignModule,
  FeedbackModule,
  SerializationGroupModule,
  EntityRangeModule,
  PersonaModule,
  TOSModule,
  BatchLazyBindingParentModule,
  CredHashModule,
];

export type GqlCtx = ExpressContext & {
  authToken: string;
  ip?: string;
  dataLoaders?: DataLoaderGetter;
  currentUser?: UserProfile;
  reqCtx: Context;
};

export class GraphqlAPIComponent implements Component, LifeCycleObserver {
  status = 'not-initialized';
  initialized = false;
  schema: any;
  private name = 'GRAPHQL-SERVER';
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication,
  ) {
    this.setupBindings();

    //------------->>>>>--------------//
    //Services
    this.app.service(GraphqlHealthService);
    this.app.service(GraphqlServiceDiscoveryService);
    this.app.service(GraphqlRingLevelMessageHandlerService);
  }

  async init() {
    await this.initRunLevel();
    this.status = 'initialized';
    this.initialized = true;
    await this.report();
  }

  async start() {
    log.info(`graphql component started`);
    this.status = 'started';
    log.info(
      ` \n ==================== Graphql server started on port: ${
        this.app?.getServerConfig('graphql')?.port
      } ======================== \n`,
    );
  }

  async graphqlMain() {
    const server = await this.createGraphQLServer();
    const apiPort = this.app?.getServerConfig('graphql')?.port;
    server.listen({port: apiPort}).then(({url}: any) => {
      log.info(`🚀 Server ready at ${url}`);
    });
  }

  async createGraphQLServer() {
    const application: any = createApplication({
      modules: MODULES,
    });
    this.schema = application.createSchemaForApollo();
    const schemWithMiddlewares = applyMiddleware(
      this.schema,
      // errorHandlerMiddleware,
      TraceLogging,
      GqlRequestLogging,
    );
    const server = new ApolloServer({
      schema: schemWithMiddlewares,
      context: ctx => {
        const requestCtx = new CommonRequestContext(this.app, {
          requestId: ctx.req?.headers?.requestId as string,
          jwt: ctx?.req?.headers?.authentication as string,
          request: ctx.req,
          response: ctx.res,
        });
        // console.log(requestCtx);
        return {
          ...ctx,
          authToken: ctx?.req?.headers?.authentication,
          dataLoaders: new DataLoaderGetter(),
          reqCtx: requestCtx,
          ip: requestIp.getClientIp(ctx?.req) ?? ctx?.req?.ip,
        };
      },
      debug: false,
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
      },
      formatError: formatError,
      plugins: [errorPlugin],
      // formatError
    });
    return server;
  }

  async stop() {
    this.status = 'stopped';
  }

  async initRunLevel() {
    const ringLevelMessageHandler = this.getRingLevelMessageHandler();
    await ringLevelMessageHandler.handleMessage({});
    await this.graphqlMain();
  }

  setupBindings() {
    //------------->>>>>--------------//
    const sd = env?.SERVICE_DISCOVERY;
    const apiPort = this.app?.getServerConfig('graphql')?.port;
    const APP_NAME = env?.APP_NAME;
    const MODIFIED_APP_NAME = 'dc-${dc}-' + APP_NAME + '-server-${server}';
    const _appName = fillTemplate(MODIFIED_APP_NAME, {
      dc: env.DATA_CENTER,
      version: pkg.version,
      instance: env.INSTANCE,
      server: 'GRAPHQL',
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
      .configure('services.GraphqlServiceDiscoveryService')
      .to(_serviceDiscoveryOptions);
  }

  async report() {
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
    log.info(chalkReportValue(this.name + ` Component Report`));
    log.info(chalkReportKey('⦿ Server:' + chalkReportValue('GRAPHQL')));
    log.info(
      chalkReportKey(
        '⦿ Port:' +
          chalkReportValue(this.app?.getServerConfig('graphql')?.port),
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
      'services.GraphqlRingLevelMessageHandlerService',
    ) as GraphqlRingLevelMessageHandlerService;
  }
}
