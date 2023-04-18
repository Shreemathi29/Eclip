/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Interceptor} from '@loopback/core';
import {object, string} from 'yup';

const ENTITY = 'pinger';

const ERROR_LOOKUP_TABLE = {
  UNPROCESSABLE_ENTITY: {
    error_code: '422',
    error_type: 'INVALID_INPUT',
    error_message: 'invalid input',
    display_message: 'invalid input',
  },
  UNKNOWN_ERROR: {
    error_code: '500',
    error_type: 'UNKNOWN_ERROR',
    error_message: null,
    display_message: `unknown error in ${ENTITY} Interceptor`,
  },
};

const CreateSchema = object().shape({
  name: string().trim().required(),
  message: string().trim().required(),
});

const GetSchema = object().shape({
  name: string().trim().required(),
});

export const validatePinger: Interceptor = async (invocationCtx, next) => {
  try {
    switch (invocationCtx.methodName) {
      case 'create':
        if (invocationCtx.args[0]) {
          const res = await CreateSchema.validate(invocationCtx.args[0]);
          invocationCtx.args[0] = {...invocationCtx.args[0], ...res};
        }
        break;
      case 'get':
        if (invocationCtx.args[0]) {
          const res = await GetSchema.validate(invocationCtx.args[0]);
          invocationCtx.args[0] = {...invocationCtx.args[0], ...res};
        }
        break;
    }
  } catch (err) {
    const _target: any = invocationCtx.target;
    return _target.res?.status(422).send({
      request_id: _target?.req?.headers['X-Request-Id'],
      error: {
        ...ERROR_LOOKUP_TABLE.UNPROCESSABLE_ENTITY,
        error_message: err.message,
        display_message: err.message,
      },
    });
  }
  const result = await next();
  return result;
};
