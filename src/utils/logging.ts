/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {
  LogFormat,
  LoggerService,
  Transporter,
} from '@vlinder-be/logger-service-node';
import {envModule} from './EnvModule';
import {fillTemplate} from './fillTemplate';

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');
const pkg = require('../../package.json');

function configureLogging() {
  const env = envModule?.getEnv();
  const logger_config = env?.LOGGER;
  const APP_NAME = pkg?.alias;
  const MODIFIED_APP_NAME = 'dc-${dc}-' + APP_NAME + '-i${instance}';

  const logFormat = new LogFormat();
  logFormat.setTimestamp().setColorize().setSimple().setSplat();

  const transporter = new Transporter();
  if (process.env?.LOGZ_ENABLE && process.env?.TRACING_TOKEN) {
    transporter.setLogz({
      level: logger_config?.level ?? 'info',
      name: logger_config?.moduleName ?? 'winston_logzio',
      token: process.env?.TRACING_TOKEN,
      host: logger_config?.host ?? 'listener.logz.io',
      protocol: logger_config?.moduleProtocol ?? 'https',
    });
  } else {
    console.warn(`=======>> logz logging token is missing << ------------`);
  }
  transporter.setConsole({
    level: defaultConfig.logging.console.level,
    handleExceptions: defaultConfig.logging.console.handleExceptions,
  });

  const loggerService = new LoggerService({
    meta: {
      service: fillTemplate(MODIFIED_APP_NAME, {
        dc: process.env?.DATA_CENTER,
        version: pkg.version,
        // platform: env.PLATFORM,
        // vertical: env.VERTICAL,
        // nop: env.NETWORK_OPERATOR,
        instance: process.env?.INSTANCE,
      }),
      instance: process.env?.INSTANCE,
      version: pkg.version,
      //@ts-ignore
      env: process.env?.NODE_ENV,
    },
    transporter: transporter,
    format: logFormat,
    exitOnError: true,
  });
  return loggerService.createLogger();
}

const log: Mylogger = configureLogging();

const transform = (obj: any, predicate: any) => {
  return Object.keys(obj || {}).reduce((memo: any, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

export const omit = (obj: any, items: any) =>
  transform(obj, (value: any, key: any) => !items.includes(key));

const pick = (obj: any, items: any) =>
  transform(obj, (value: any, key: any) => items.includes(key));

function pretty(param: any, strip = true): string {
  try {
    let _temp: any = param;
    if (typeof param === 'object') {
      if (strip) {
        _temp = omit(_temp, ['access_token', 'secret', 'sk']);
      }
      const _res = JSON.stringify(_temp);
      return _res;
    }
    return param;
  } catch (err) {
    log.error('CRITICAL : console pretty error', {pretyinputparams: param});
    return '';
  }
}
interface Mylogger {
  warn: (msg?: string, obj?: object) => {};
  error: (msg?: string, obj?: object) => {};
  info: (msg?: string, obj?: object) => {};
  debug: (msg?: string, obj?: object) => {};
}

export {log, pretty};
