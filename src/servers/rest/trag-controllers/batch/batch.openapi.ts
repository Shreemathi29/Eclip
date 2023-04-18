/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/camelcase */

import {RequestBodyObject, ResponseObject, SchemaObject} from '@loopback/rest';

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

export const GetBatchesRequestSchema: SchemaObject = {
  type: 'object',
  required: ['gtinKey'],
  title: 'GetBatchesRequest',
  properties: {
    gtin: {
      type: 'string',
    },
  },
};

export const GetBatchesResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetBatchesResponse',
  properties: {
    data: {
      type: 'array',
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const GET_BATCHES_REQUEST: RequestBodyObject = {
  description: 'Get batches request fields',
  required: true,
  content: {
    'application/json': {schema: GetBatchesRequestSchema},
  },
};

export const GET_BATCHES_RESPONSE: ResponseObject = {
  description: 'Get batches response fields',
  content: {
    'application/json': {
      schema: GetBatchesResponseSchema,
    },
  },
};
