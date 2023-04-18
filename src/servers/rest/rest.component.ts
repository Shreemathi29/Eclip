/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {VApplication} from '@/application';
import {CommonBindings} from '@/common/request-context/common-bindings';
import {config, inject} from '@loopback/context';
import {
  ApplicationConfig,
  Component,
  CoreBindings,
  LifeCycleObserver,
} from '@loopback/core';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
  RestExplorerConfig,
} from '@loopback/rest-explorer';
import {chalkReportKey, chalkReportValue} from '@utils/chalkColors';
import {EnvModule} from '@utils/EnvModule';
import {fillTemplate} from '@utils/fillTemplate';
import {log} from '@utils/logging';
import path from 'path';
import {PingController} from './controllers';
import {CredentialExternalViewController} from './controllers/credential/credential.openapi';
import {EvidenceAttachmentController} from './controllers/evidence-attachment/evidence-attachment.controller';
import {MapLocationController} from './controllers/mapLocation/mapLocation.controller';
import {WebhookController} from './controllers/webhook/webhook.controller';
import {RestRingLevelMessageHandlerService} from './handlers/ring-level-handlers';
import {isdevEnv} from './openapi';
import {MySequence} from './sequence';
import {RestHealthService, RestServiceDiscoveryService} from './services';
import {BatchController} from './trag-controllers/batch/batch.controller';
import {EncoderController} from './trag-controllers/encoder/encoder.controller';
import {FeedbackController} from './trag-controllers/feedback/feedback.controller';
import {ProvenanceController} from './trag-controllers/provenance/provenance.controller';
import {ThirdEyeController} from './trag-controllers/thirdEye/thirdEye.controller';

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');
const pkg = require('../../../package.json');

const is = require('is_js');

const env = EnvModule?.getInstance()?.getEnv();

export class RESTAPIComponent implements Component, LifeCycleObserver {
  status = 'not-initialized';
  initialized = false;
  public name = 'REST-SERVER';
  public restAppCtx: RestApplication;
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: VApplication, // @inject()
    @config() private restConfig: ApplicationConfig,
  ) {
    this.restAppCtx = new RestApplication(this.restConfig, this.app);
    this.setupBindings();

    //------------->>>>>--------------//
    //Components
    this.restAppCtx.component(RestExplorerComponent);
    this.restAppCtx.bind(CommonBindings.SERVER_NAME).to(this.name);
    //------------->>>>>--------------//
    this.restAppCtx.static('/', path.join(__dirname, '../../../public'));
    this.restAppCtx.api(this.getSecuritySpec());
    //------------->>>>>--------------//
    //
    //Sequence
    this.restAppCtx.sequence(MySequence);

    //------------->>>>>--------------//
    //Controllers
    this.restAppCtx.controller(PingController);
    // this.restAppCtx.controller(PingerController);
    this.restAppCtx.controller(WebhookController);
    this.restAppCtx.controller(EvidenceAttachmentController);
    this.restAppCtx.controller(ProvenanceController);
    this.restAppCtx.controller(MapLocationController);
    this.restAppCtx.controller(FeedbackController);
    this.restAppCtx.controller(BatchController);
    this.restAppCtx.controller(EncoderController);
    this.restAppCtx.controller(ThirdEyeController);

    // this.restAppCtx.controller(HolderController);
    // this.restAppCtx.controller(VerificationHolderController);
    // this.restAppCtx.controller(CredentialController);
    this.restAppCtx.controller(CredentialExternalViewController);

    //------------->>>>>--------------//
    //Services
    this.restAppCtx.service(RestHealthService);
    this.restAppCtx.service(RestServiceDiscoveryService);
    this.restAppCtx.service(RestRingLevelMessageHandlerService);
  }
  async init() {
    await this.initRunLevel();
    this.status = 'initialized';
    this.initialized = true;
  }

  async start() {
    await this.restAppCtx.restServer.start();
    await this.report();
    log.info(`${this.constructor.name} started`);
    this.status = 'started';
    // get a singleton HTTP server instance
    // this.restAppCtx.restServer.on;
    log.info(
      ` \n ==================== ${this.name} started on port: ${this.restAppCtx?.restServer.config.port} ======================== \n`,
    );
    // await this.newServer();
  }

  async stop() {
    this.status = 'stopped';
  }

  setupBindings() {
    //------------->>>>>--------------//

    //------------->>>>>--------------//
    const restExplorerConfig: RestExplorerConfig = {
      path: '/explorer',
    };
    this.restAppCtx
      .configure(RestExplorerBindings.COMPONENT)
      .to(restExplorerConfig);
    //------------->>>>>--------------//

    const sd = env?.SERVICE_DISCOVERY;

    const APP_NAME = env?.APP_NAME;
    const MODIFIED_APP_NAME = 'dc-${dc}-' + APP_NAME + '-server-${server}';
    const _appName = fillTemplate(MODIFIED_APP_NAME, {
      dc: env.DATA_CENTER,
      version: pkg.version,
      instance: env.INSTANCE,
      server: this.name,
    });
    const _serviceDiscoveryOptions: any = {
      serviceName: _appName,
      heartBeatInSecs: sd.heartbeat,
      port: this.restAppCtx.restServer?.config.port,
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
    this.restAppCtx
      .configure('services.RestServiceDiscoveryService')
      .to(_serviceDiscoveryOptions);
  }

  getSecuritySpec() {
    return {
      openapi: '3.0.0',

      info: {
        title: pkg.name,
        version: pkg.version,
        description: '',
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
        'x-logo': {
          url: 'https://s3.ap-south-1.amazonaws.com/io.vlinder.public/vlinder-logo_80x80.png',
          altText: 'vlinder Logo',
          href: 'https://www.vlinder.io/blogs/monarch',
        },
      },
      paths: {},
      //  components: {securitySchemes: SECURITY_SCHEME_SPEC},
      security: [
        {
          jwt: [],
        },
      ],
      servers: this.getServers(),
    };
  }

  getServers() {
    const servers: {url: string; description: string}[] = [];
    if (isdevEnv)
      servers.push({
        url: `http://localhost:${this.restAppCtx?.restServer.config.port}`,
        description: 'local Server',
      });
    servers.push({
      url: process.env.SERVER_URL as string,
      description: 'Production Server',
    });
    return servers;
  }

  async initRunLevel() {
    const ringLevelMessageHandler = this.getRingLevelMessageHandler();
    await ringLevelMessageHandler.handleMessage({});
  }

  async report() {
    // const servers = this.getServers();
    log.info(chalkReportKey(`⚡⚡⚡===================⚡⚡⚡`));
    log.info(chalkReportValue(this.name + ` Component Report`));
    log.info(chalkReportKey('⦿ Server:' + chalkReportValue('REST')));
    log.info(
      chalkReportKey(
        '⦿ Port:' +
          chalkReportValue(this.restAppCtx?.restServer.config.port?.toString()),
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
    return this.restAppCtx.getSync(
      'services.RestRingLevelMessageHandlerService',
    ) as RestRingLevelMessageHandlerService;
  }
}
