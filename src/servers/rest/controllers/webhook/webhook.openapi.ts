/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {RequestBodyObject, ResponseObject, SchemaObject} from '@loopback/rest';

// const entity = 'pinger';

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

export const WEBHOOK_NOTIFICATION: RequestBodyObject = {
  description: 'webhookNotification',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'webhookNotification',
        properties: {
          type: {
            type: 'string',
          },
          payload: {
            type: 'object',
          },
        },
      },
    },
  },
};

export const WEBHOOK_ACKNOWLEDGEMENT: ResponseObject = {
  description: 'webhookAcknowledgement',
  content: {
    'application/json': {
      schema: {
        type: 'string',
      },
    },
  },
};
