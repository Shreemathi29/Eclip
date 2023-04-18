/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {onWorkerMessage} from '@/common/background-job-workers';
import {bool, cleanEnv, json, num, str} from 'envalid';
import _ from 'lodash';

const findFreePort = require('find-free-port-sync');
const is = require('is_js');
const fs = require('fs');
export class EnvModule {
  static instance: EnvModule;
  private env: any;
  private constructor() {
    const _env = cleanEnv(process.env, {
      NODE_ENV: str({
        choices: [
          'development',
          'test',
          'production',
          'staging',
          'dev',
          'prod',
        ],
      }),
      SERVERS: json({desc: 'servers configuration'}),
      MODULES: json({desc: 'modules configuration', default: []}),
      DATABASES: json({desc: 'databases configuration'}),
      LOGGER: json({desc: 'logger configuration'}),
      SERVICE_DISCOVERY: json({desc: 'Service Discovery configuration'}),
      VERIFY_CRDENTIAL_CONFIG: json({desc: 'Verification credential config'}),
      APP_NAME: str(),
      PLATFORM: str({default: 'vlinder'}),
      VERTICAL: str({default: 'nil'}),
      NETWORK_OPERATOR: str({default: 'nil'}),
      INSTANCE: str({default: 'tbd'}),
      HOST: str({default: 'http://127.0.0.1'}),
      DATA_CENTER: str({choices: ['ca', 'in', 'dev'], devDefault: 'dev'}),
      WORKER_DB_PATH: str({default: '_db/io.vlinder.default'}),
      WORKER_DB_SCHEMA: num({default: 0}),
      WORKERS: json({desc: 'workers configuration', default: []}),
      LOGZ_ENABLE: bool({default: false}),
      TRACING_TOKEN: str(),
      CAK_URL: str(),
      FLINSTONE_URL: str(),
      MICKEY_URL: str(),
      POWERPUFF_URL: str(),
      SHAGGY_URL: str(),
      KLEFKI_LOGIN_URL: str(),
      APPLICATION_GATEWAY_URL: str(),
      SAP_URL: str(),
      KLEFKI_LOGIN_APP_BASE_URI: str(),
      VLN_LOGIN_PORT: str(),
      OWN_APP_BASEURI: str(),
      ORG_ID: str(),
      MAIL_CONFIG: json({desc: 'Verification email config'}),
      FEEDBACK_MAIL_CONFIG: json({desc: 'Feedback email config'}),
      GEOCODER_API_KEY: str(),
      CREDENTIAL_FORM_URL: str(),
      AWS_S3_ACCESS_KEY_ID: str(),
      SCHEDULER_RUN_IMMEDIATELY: str(),
      SCHEDULER_SCHEDULE_RULE: str(),
      AWS_S3_BUCKET_NAME: str(),
      AWS_S3_REGION: str(),
      AWS_S3_SECRET_ACCESS_KEY: str(),
      DYNAMSOFT_LICENSE_KEY: str(),
      TRINETRA_URL: str(),
      GET_DECODED_INFO_FROM_MONARCHA: bool(),
      ITEM_SERIALISATION_WITH_VOUCHER: bool(),
      FSSAI_OPTIONAL: bool(),
      GET_SAP_ANALYTICS: bool(),
      PROV_FETCH_ORDER: str(),
      JWT_AUTH_TOKEN: str(),
      CACHE_CONFIG: json(),
      SIGNAUTE_MASTER_GTINS_FOR_CUSTOM_DISPLY: json({
        desc: 'signature master gtins',
      }),

      //       CLIENT_ID: str(), //TODO: Need to add this in env file on server.
      //       SECRET: str(),
      //       SIGNIN_EMAIL: str(),
    });
    if (
      _env &&
      is.existy(_env) &&
      is.existy(_env.SERVERS) &&
      is.array(_env.SERVERS)
    ) {
      const _servers = _env.SERVERS;
      _servers.forEach((server: any) => {
        if (server?.port && is.array(server?.port)) {
          const port = findFreePort({
            start: _.min(server.port),
            end: _.max(server.port),
            num: 1,
          });
          server.port = port;
        }
      });
    }
    if (
      _env &&
      is.existy(_env) &&
      is.existy(_env.WORKERS) &&
      is.array(_env.WORKERS)
    ) {
      const _workers = _env.WORKERS;
      _workers.forEach((worker: any) => {
        worker.cb = onWorkerMessage;
      });
    }
    this.env = _env;
  }

  static getInstance() {
    if (!EnvModule.instance) {
      EnvModule.instance = new EnvModule();
    }
    return EnvModule.instance;
  }

  getEnv() {
    return this.env;
  }
}

export const envModule = EnvModule.getInstance();
