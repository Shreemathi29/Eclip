/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log, pretty} from '@utils/logging';
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

const PingSchema = object().shape({
  name: string().trim().required(),
});

export const ping = async (args: any = {}) => {
  try {
    let res = await PingSchema.validate(args);
    res = {...args, ...res};
    return res;
  } catch (err) {
    log.error(`error in create ${ENTITY}:  ${pretty(err.message)}`);
    return {
      error: {
        ...ERROR_LOOKUP_TABLE.UNPROCESSABLE_ENTITY,
        error_message: err.message,
        display_message: err.message,
      },
    };
  }
};
