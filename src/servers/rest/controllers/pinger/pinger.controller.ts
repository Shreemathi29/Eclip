/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {inject, intercept} from '@loopback/core';
import {
  oas,
  post,
  Request,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {log, pretty} from '@utils/logging';
import {apiVisibility} from '../../openapi';
import {validatePinger} from './pinger.interceptor';
import {ICreatePinger, IGetPinger, Pinger} from './pinger.model';
import {
  CREATE_PINGER_REQUEST,
  CREATE_PINGER_RESPONSE,
  GET_PINGER_REQUEST,
  GET_PINGER_RESPONSE,
} from './pinger.openapi';

const entity = 'pinger';
const ENTITY = Pinger;

const is = require('is_js');

const ERROR_LOOKUP_TABLE = {
  UNKNOWN_ERROR: {
    error_code: '500',
    error_type: 'UNKNOWN_ERROR',
    error_message: null,
    display_message: `unknown error in ${entity} Validation`,
  },
  ENTITY_NOT_FOUND: {
    error_code: '404',
    error_type: 'NOT_FOUND_ERROR',
    error_message: `Given ${entity} is not found`,
    display_message: `${entity} for the request is not determined`,
  },
};

@oas.visibility(apiVisibility)
@intercept(validatePinger)
export class PingerController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(RestBindings.Http.RESPONSE) private res: Response,
  ) {}

  @post('/pinger/create', {
    summary: 'Create a new Pinger Message',
    description: `This endpoint creates a new Pinger message`,
    operationId: 'createPinger',
    responses: {
      '200': CREATE_PINGER_RESPONSE,
    },
  })
  async create(@requestBody(CREATE_PINGER_REQUEST) param: ICreatePinger) {
    try {
      //@ts-ignore
      const _entity = await ENTITY.findOneOrCreate({name: param.name}, param);
      const _res = {
        [entity]: {
          name: _entity?.name,
          message: _entity?.message,
        },
        error: null,
      };
      return _res;
    } catch (err) {
      log.error(`error in create ${entity}:  ${pretty(err.message)}`);
      const _res = {
        [entity]: null,
        error: {
          ...ERROR_LOOKUP_TABLE.UNKNOWN_ERROR,
          error_message: err?.message,
        },
      };
      return _res;
    }
  }

  @post('/pinger/get', {
    summary: 'Get a Pinger Message',
    description: `This endpoint get a Pinger message`,
    operationId: 'getPinger',
    responses: {
      '200': GET_PINGER_RESPONSE,
    },
  })
  async get(@requestBody(GET_PINGER_REQUEST) param: IGetPinger) {
    try {
      const _entity = await ENTITY.findOne({
        name: param.name,
      });
      if (!_entity) {
        const _res: any = {
          [entity]: null,
          error: ERROR_LOOKUP_TABLE.ENTITY_NOT_FOUND,
        };
        return _res;
      }
      const _res = {
        [entity]: _entity,
        error: null,
      };
      return _res;
    } catch (err) {
      log.error(`error in get ${entity}:  ${pretty(err.message)}`);
      const _res = {
        contract: null,
        error: {
          ...ERROR_LOOKUP_TABLE.UNKNOWN_ERROR,
          error_message: err?.message,
        },
      };
      return _res;
    }
  }
}
