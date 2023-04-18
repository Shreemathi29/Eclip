/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RequestBodyObject, ResponseObject, SchemaObject} from '@loopback/rest';

const entity = 'pinger';

export const ErrorObject: SchemaObject = {
  type: 'object',
  nullable: true,
  properties: {
    error_type: {
      type: 'string',
      nullable: true,
    },
    error_code: {
      type: 'string',
      nullable: true,
    },
    error_message: {
      type: 'string',
      nullable: true,
    },
    display_message: {
      type: 'string',
      nullable: true,
    },
  },
};

export const CREATE_PINGER_REQUEST: RequestBodyObject = {
  description: 'createPingerRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['name', 'message'],
        title: 'createPingerRequest',
        properties: {
          name: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const CREATE_PINGER_RESPONSE: ResponseObject = {
  description: 'createPingerResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'createPingerResponse',

        properties: {
          [entity]: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              message: {type: 'string'},
            },
          },
          error: ErrorObject,
          request_id: {
            type: 'string',
            nullable: true,
          },
        },
      },
    },
  },
};

export const GET_PINGER_REQUEST: RequestBodyObject = {
  description: 'getPingerRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['name'],
        title: 'createPingerRequest',
        properties: {
          name: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const GET_PINGER_RESPONSE: ResponseObject = {
  description: 'getPingerResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'getPingerResponse',

        properties: {
          [entity]: {
            type: 'object',
            properties: {
              name: {type: 'string'},
              message: {type: 'string'},
            },
          },
          error: ErrorObject,
          request_id: {
            type: 'string',
            nullable: true,
          },
        },
      },
    },
  },
};
