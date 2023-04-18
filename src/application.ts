/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

require('dotenv').config();
if (
  process.env.NODE_ENV === 'test' ||
  process.env.ENABLE_VAULT?.trim().toLowerCase() === 'false'
) {
  //
} else {
  require('vault-env/rotate');
}

import {CredentialConfig} from '@common/modules/credential/credential-common.service';
import {VlinderLoginCommonService} from '@common/modules/users/vlinder-login.service';
import {
  ClientService,
  EmailGeneratorService,
  MongooseService,
  PingerService,
  SAPService,
  WorkerClientService,
} from '@common/services/index';
import {Application, ApplicationConfig, BindingKey} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {GRPCAPIComponent} from '@servers/grpc/grpc.component';
import {
  chalkModuleKey,
  chalkReportKey,
  chalkReportValue,
} from '@utils/chalkColors';
import {envModule} from '@utils/EnvModule';
import {AssetCatalogueModule} from '@vlinder-be/asset-catalogue-module/dist/module';
import {EventBusService} from '@vlinder-be/event-bus-service-node';
import {FSMModule} from '@vlinder-be/fsm-module-node';
// import { } from "@vlinder-be/ipfs-pinning-module-node";
import {MemstoreService} from '@vlinder-be/memstore-service-node';
import {ShortUUIDService} from '@vlinder-be/short-uuid-service-node';
import _ from 'lodash';
import nodeSchedule from 'node-schedule';
import path from 'path';
import {ks1} from '../compiled';
import {
  GRPCConnectComponent,
  GRPCServiceConfig,
  ks1KeyString,
  KS1_DECODER_KEY,
} from './clients/grpc/grpc-connect/grpc-connect.component';
import {GRPCConnectFactoryService} from './clients/grpc/grpc-connect/grpc-connect.factory.service';
import {ApplicationGatewayClient} from './clients/rest/application-gatewat.client';
import {CredentialFormClient} from './clients/rest/credential-form.client';
import {FlinstoneClient} from './clients/rest/flinstone.client';
import {KlefkiLoginClient} from './clients/rest/klefki-login.client';
import {MonarchaClient} from './clients/rest/monarcha.client';
import {PowerpuffClient} from './clients/rest/powerpuff.client';
import {RestClientConfig} from './clients/rest/rest.client';
import {SapClient} from './clients/rest/sap.client';
import {WalletClient, WalletClientConfig} from './clients/rest/wallet.client';
import {CredentialViewService} from './common/modules/credential';
import {ProvSuggestionsCommonService} from './common/modules/fullProvenance/provSuggestions.common.service';
import {LateBindingCounterCommonService} from './common/modules/lateBindingCounters/lateBindingCounter.common.service';
import {IssueManyProvCredService} from './common/modules/provenance/issueManyProvCred.helper';
import {AWSS3Config, AWSService} from './common/services/aws-s3.service';
import {CacheService} from './common/services/cache.service';
import {FormTemplateService} from './common/services/formTemplateService';
import {
  GeocoderConfig,
  GeocoderService,
} from './common/services/geocoder.service';
import {AnalyticsJobHandlerService} from './components/scheduler/analytics.jobHandler.service';
import {SchedulerComponent} from './components/scheduler/scheduler.component';
import {GraphqlAPIComponent} from './servers/graphql/graphql.component';
import {CAKClient} from './servers/rest/cak.client';
import {RESTAPIComponent} from './servers/rest/rest.component';
import {RESTInternalAPIComponent} from './servers/rest/rest.internal.component';
import {VlinderLoginRESTAPIComponent} from './servers/rest/rest.vlinder-login.component';
import {TestUtilService} from './test/testUtllService';
import {GlobalBindingKeys} from './utils/binding-keys';
import {getServiceName} from './utils/loopbackUtils';

const {asTree} = require('treeify');

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');
const verifyConfig = yaml_config.load('./src/config/verify.config.yml');
const ageVerificationConfig = yaml_config.load(
  './src/config/age-verification.config.yml',
);
const {log, pretty} = require('@utils/logging');
const is = require('is_js');

export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

let vidCtx: VApplication;

export function getVidCtx() {
  return vidCtx;
}

type ServerType =
  | 'rest'
  | 'graphql'
  | 'grpc'
  | 'rest-internal'
  | 'rest-login-internal'
  | 'rest-client';

const env: any = envModule?.getEnv();
const getServerConfig = (server: ServerType) => {
  const found = _.find(env?.SERVERS, {server: server});
  if (found && is.existy(found) && is.not.empty(found)) {
    return found;
  }
};

const isServerEnabled = (server: ServerType) => {
  const found = _.find(env?.SERVERS, {server: server});
  if (found && is.existy(found) && is.not.empty(found)) {
    return found.enable ?? false;
  }
};

export class VApplication extends RepositoryMixin(Application) {
  options: ApplicationConfig;
  selectedServices: string[] = [];
  ringLevelServices: {name: string; service: any}[] = [];
  constructor(
    options: ApplicationConfig = {
      rest: {
        port: getServerConfig('rest')?.port,
        listenOnStart: isServerEnabled('rest'),
      },
    },
  ) {
    super(options);
    this.component(SchedulerComponent);
    vidCtx = this;
    this.setupBindings();
    this.setupGrpcBindings();
    //*this.setupJob()

    //------------->>>>>--------------//
    //Services
    this.initCommonServices();
    this.selectiveServices();

    //------------->>>>>--------------//
    //Servers
    if (process.env.NODE_ENV !== 'test') {
      this.selectiveServers();
    }

    //------------->>>>>--------------//
    //Modules
    this.selectiveModules();
  }

  // @ts-ignore
  async start() {
    await super.start();
    await this.initRunLevel();
    await this.report();
    // this.setupJob();
  }

  setupBindings() {
    //------------->>>>>--------------//
    this.bind('env').to(envModule?.getEnv());
    this.bind('ORG_ID').to(envModule?.getEnv().ORG_ID);
    this.bind('mailer.config').to(envModule?.getEnv().MAIL_CONFIG);
    this.bind('feedbackMailer.config').to(
      envModule?.getEnv().FEEDBACK_MAIL_CONFIG,
    );
    this.bind('defaultConfig').to(defaultConfig);
    this.service(CAKClient);
    // ------------------------------------------------
    const env = this.getEnv();
    // ------------------------------
    this.bind(GlobalBindingKeys.CACHE_CONFIG).to(
      envModule.getEnv().CACHE_CONFIG,
    );
    // -----------------------
    const cakClientConfig: RestClientConfig = {
      baseUrl: env.CAK_URL as string,
    };
    this.configure('services.CAKClient').to(cakClientConfig);
    // -------------------------------------------------------------------------
    const goecoderConfig: GeocoderConfig = {
      apiKey: env.GEOCODER_API_KEY, //TODO change env to vault
      provider: 'google',
    };
    this.configure(getServiceName(GeocoderService)).to(goecoderConfig);
    // -------------------------------------------------------------------------
    const defaultRestConfig: ApplicationConfig = {
      rest: {
        port: getServerConfig('rest')?.port,
        listenOnStart: isServerEnabled('rest'),
      },
    };

    this.configure('components.RESTAPIComponent').to(defaultRestConfig);
    //----------------------------------------------------------------------------
    const vlnInternalRestConfig: ApplicationConfig = {
      rest: {
        port: this.getServerConfig('rest-login-internal')?.port,
        listenOnStart: this.isServerEnabled('rest-login-internal'),
      },
    };

    this.configure('components.VlinderLoginRESTAPIComponent').to(
      vlnInternalRestConfig,
    );

    // --------------------------------------------------------------
    const clientRestConfig: ApplicationConfig = {
      rest: {
        port: this.getServerConfig('rest-internal')?.port,
        listenOnStart: this.isServerEnabled('rest-internal'),
      },
    };

    this.configure('components.RESTInternalAPIComponent').to(clientRestConfig);
    // -----------------------------------------------------------------
    this.bind('config.mailConfig').to(defaultConfig.mailConfig);
    this.bind('config.coreConfig').to(defaultConfig.coreConfig);
    this.bind('config.ageVerificationConfig').to(ageVerificationConfig);
    const credetialConfig: CredentialConfig = {
      externalId: env?.ORG_ID,
      ownBaseURL: env?.OWN_APP_BASEURI,
      evidenceBucket: env?.AWS_S3_BUCKET_NAME,
      ...defaultConfig.credential,
    };
    this.bind('config.credential').to(credetialConfig);
    this.bind('config.defaultConfig').to(defaultConfig);
    // ------------------------------------------------------------------
    this.configure('services.CredentialViewService').to(verifyConfig);
    const walletConfig: WalletClientConfig = {
      baseUrl: env?.SHAGGY_URL as string,
    };
    this.configure('services.WalletClient').to(walletConfig);
    // ------------------------------------------------------------------
    // ------------------------------------------------------------------

    const klefkiLoginConfig: WalletClientConfig = {
      baseUrl: env?.KLEFKI_LOGIN_URL as string,
    };
    this.configure(getServiceName(KlefkiLoginClient)).to(klefkiLoginConfig);
    // ------------------------------------------------------------------

    // ------------------------------------------------------------------
    const monarchaConfig: RestClientConfig = {
      baseUrl: env?.MICKEY_URL as string,
    };
    this.configure('services.MonarchaClient').to(monarchaConfig);
    // ------------------------------------------------------
    const flinstoneConfig: RestClientConfig = {
      baseUrl: env?.FLINSTONE_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.FlinstoneClient').to(flinstoneConfig);
    // ------------------------------------------------------------------
    const powerPuffConfig: RestClientConfig = {
      baseUrl: env?.POWERPUFF_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.PowerpuffClient').to(powerPuffConfig);
    // --------------------------------------------------
    const applicationGatewatConfig: RestClientConfig = {
      baseUrl: env?.APPLICATION_GATEWAY_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.ApplicationGatewayClient').to(
      applicationGatewatConfig,
    );
    // --------------------------------------------------
    const trinetraConfig: RestClientConfig = {
      baseUrl: env?.TRINETRA_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.TrinetraClient').to(trinetraConfig);
    // --------------------------------------------------
    const sapConfig: RestClientConfig = {
      baseUrl: env?.SAP_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.SapClient').to(sapConfig);
    // --------------------------------------------------
    const credentialFormClient: RestClientConfig = {
      baseUrl: env?.CREDENTIAL_FORM_URL as string,
      orgId: env?.ORG_ID,
    };
    this.configure('services.CredentialFormClient').to(credentialFormClient);
    // -------------------------------------------------

    const awsS3Config: AWSS3Config = {
      accessKeyId: env?.AWS_S3_ACCESS_KEY_ID,
      bucketName: env?.AWS_S3_BUCKET_NAME,
      region: env?.AWS_S3_REGION,
      secretAccessKey: env?.AWS_S3_SECRET_ACCESS_KEY,
      preSignedurlExpirySeconds: 300,
    };
    this.configure('services.AWSService').to(awsS3Config);
  }

  setupJob() {
    const analyticJobHandlerService = this.getSync(
      'services.AnalyticsJobHandlerService',
    ) as AnalyticsJobHandlerService;
    const rule = new nodeSchedule.RecurrenceRule();
    rule.second = 1;
    const scheduleRuleString = process.env.SCHEDULER_SCHEDULE_RULE;
    log.info(`schedule rule = ${scheduleRuleString}`);
    if (!scheduleRuleString) throw new Error(`no schedule rule is present`);
    // ('1 * * * * * ');
    nodeSchedule.scheduleJob(
      scheduleRuleString,
      analyticJobHandlerService.job.bind(analyticJobHandlerService),
    );
    if (process.env.SCHEDULER_RUN_IMMEDIATELY?.toLowerCase() === 'true') {
      analyticJobHandlerService.job();
    }
    log.info(`scheduler started, ${scheduleRuleString}`);
  }

  async initRunLevel() {
    if (this.ringLevelServices) {
      this.ringLevelServices.forEach(
        async (item: {service: any; name: string}) => {
          if (
            item?.service &&
            is.existy(item?.service) &&
            item?.service?.init
          ) {
            log?.info(`|-> ${item?.name} Init`);
            await item.service.init();
            log?.info(`<-| ${item?.name} Init`);
          }
        },
      );
    }
  }

  async report() {
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
    log.info(chalkReportValue(`App Report`));
    log.info(chalkReportKey('⦿ App Name:' + chalkReportValue(pkg.name)));
    log.info(chalkReportKey('⦿ Version:' + chalkReportValue(pkg.version)));
    log.info(chalkReportKey('⦿ Environment:' + chalkReportValue(env.NODE_ENV)));
    log.info(chalkReportKey('⦿ Platform:' + chalkReportValue(env.PLATFORM)));
    log.info(chalkReportKey('⦿ Vertical:' + chalkReportValue(env.VERTICAL)));
    log.info(
      chalkReportKey(
        '⦿ Network Operator:' + chalkReportValue(env.NETWORK_OPERATOR),
      ),
    );
    log.info(
      chalkReportKey('⦿ Data center:' + chalkReportValue(env?.DATA_CENTER)),
    );
    log.info(
      chalkReportKey('⦿ logz Server:' + chalkReportValue(env?.LOGGER?.enable)),
    );
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
  }

  getEnv() {
    return this.getSync('env') as any;
  }

  // async unitTest() {
  //   const ut = new UnitTest(this);
  //   await ut.run();
  // }

  isServerEnabled(server: ServerType) {
    const env: any = this.getEnv();
    const found = _.find(env?.SERVERS, {server: server});
    if (found && is.existy(found) && is.not.empty(found)) {
      return found.enable ?? false;
    }
  }

  isModuleEnabled(module: string) {
    const env: any = this.getEnv();
    const found = _.find(env?.MODULES, {module: module});
    if (found && is.existy(found) && is.not.empty(found)) {
      return found.enable ?? false;
    }
  }

  getServerConfig(server: ServerType) {
    const env: any = this.getEnv();
    const found = _.find(env?.SERVERS, {server: server});
    if (found && is.existy(found) && is.not.empty(found)) {
      return found;
    }
  }

  initCommonServices() {
    // -------------------------------------
    this.service(CacheService);
    this.service(PingerService);
    this.service(SAPService);
    this.service(EventBusService);
    this.service(MemstoreService);
    this.service(VlinderLoginCommonService);
    this.service(WalletClient);
    this.service(EmailGeneratorService);
    this.service(ClientService);
    this.service(KlefkiLoginClient);
    this.service(CredentialViewService);
    this.service(AnalyticsJobHandlerService);
    this.service(MonarchaClient);
    this.service(GeocoderService);
    this.service(PowerpuffClient);
    this.service(IssueManyProvCredService);
    this.service(ApplicationGatewayClient);
    this.service(ProvSuggestionsCommonService);
    this.service(SapClient);
    this.service(LateBindingCounterCommonService);
    this.service(TestUtilService);
    this.service(ShortUUIDService);
    this.service(FormTemplateService);
    // this.service(CredTranCommonService);
    // this.service(CredentialService);
    // this.service(CredentialCommonService);
    // this.service(OrganizationService);
    this.service(FlinstoneClient);
    this.service(CredentialFormClient);
    this.service(AWSService);
    // this.service(RoleCommonService);
    // this.service(NetworkGraphCommonService);
    // this.service(VPRService);

    // -------------componenets -----------------
    this.component(GRPCConnectComponent);
    this.component(AssetCatalogueModule);
    // ------------------------------------------

    this.selectedServices = [
      ...this.selectedServices,
      'PingerService',
      'EventBusService',
      'MemstoreService',
      'VlinderLoginCommonService',
    ];
  }

  selectiveServers() {
    const env: any = this.getEnv();
    const selected: string[] = [];

    //------------->>>>>--------------//
    if (this.isServerEnabled('rest')) {
      this.component(RESTAPIComponent);
      selected.push(RESTAPIComponent.name);
    }

    if (this.isServerEnabled('rest-login-internal')) {
      this.component(VlinderLoginRESTAPIComponent);
      selected.push(VlinderLoginRESTAPIComponent.name);
    }
    // --------------------------------------
    if (this.isServerEnabled('rest-internal')) {
      this.component(RESTInternalAPIComponent);
      selected.push(RESTInternalAPIComponent.name);
    }
    //------------->>>>>--------------//
    if (this.isServerEnabled('graphql')) {
      this.component(GraphqlAPIComponent);
      selected.push('GRAPHQL-SERVER');
    }

    //------------->>>>>--------------//
    if (this.isServerEnabled('grpc')) {
      this.component(GRPCAPIComponent);
      selected.push('GRPC-SERVER');
    }
    //------------->>>>>--------------//

    console.log(chalkReportKey('Enabled Servers: '));
    console.log(chalkReportKey(asTree(selected, true)));
    log.info(`Enabled Servers: ${pretty(selected)}`);
  }

  selectiveModules() {
    const selected: string[] = [];

    //------------->>>>>--------------//
    if (this.isModuleEnabled('fsm')) {
      this.component(FSMModule);
      selected.push('FSM-MODULE');
    }
    //------------->>>>>--------------//

    console.log(chalkModuleKey('Enabled Modules: '));
    console.log(chalkModuleKey(asTree(selected, true)));
    log.info(`Enabled Modules: ${pretty(selected)}`);
  }

  selectiveServices() {
    const env: any = this.getEnv();

    //------------->>>>>--------------//
    const MONGODB = _.find(env?.DATABASES, {database: 'mongodb'});
    if (
      MONGODB &&
      is.existy(MONGODB) &&
      is.not.empty(MONGODB) &&
      MONGODB.enable
    ) {
      this.service(MongooseService);
      this.configure('services.MongooseService').to(MONGODB.url);
      this.ringLevelServices.push({
        name: 'mongoose',
        service: this.getSync('services.MongooseService') as MongooseService,
      });
      this.selectedServices.push('MongooseService');
    }
    //------------->>>>>--------------//

    //------------->>>>>--------------//
    if (this.isModuleEnabled('worker')) {
      this.service(WorkerClientService);
      this.configure('services.WorkerClientService').to({
        path: env?.WORKER_DB_PATH,
        schemaVersion: env?.WORKER_DB_SCHEMA,
        workers: env?.WORKERS,
      });
      this.ringLevelServices.push({
        name: 'worker',
        service: this.getSync(
          'services.WorkerClientService',
        ) as WorkerClientService,
      });
      this.selectedServices.push('WorkerService');
    }
    //------------->>>>>--------------//

    console.log(chalkReportKey('Enabled Services: '));
    console.log(chalkReportKey(asTree(this.selectedServices, true)));
    log.info(`Enabled Services: ${pretty(this.selectedServices)}`);
  }

  setupGrpcBindings() {
    const KS1EncoderSerConfig = [
      process.env.KS1_ENCODER_GRPC_URL, //TODO
      process.env.KS1_ENCODER_GRPC_SD_NAME,
      './servers/grpc/protos/ks1.proto',
    ];

    // this.app.configure('services.MailerGrpcService').to(MailerGrpcConfig);
    const Ks1EncodeGrpcService = new GRPCConnectFactoryService<ks1.KS1Service>(
      this,
      this.getGrpcConfig(KS1EncoderSerConfig),
      ks1KeyString,
    );
    this.bind(KS1_DECODER_KEY).to(Ks1EncodeGrpcService);
  }

  private getGrpcConfig(param: (string | undefined)[]) {
    const config: GRPCServiceConfig = {
      grpcPort: param[0],
      grpcServiceDiscoveryName: param[1],
      protoPath: path.resolve(__dirname, param[2] as string),
    };
    return config;
  }
}
