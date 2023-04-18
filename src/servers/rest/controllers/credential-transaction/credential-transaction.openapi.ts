/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
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

export const pagination: SchemaObject = {
  type: 'object',
  nullable: true,
  properties: {
    totalCount: {
      type: 'integer',
    },
    currentPage: {
      type: 'integer',
    },
    pageSize: {
      type: 'integer',
    },
    totalPages: {
      type: 'integer',
    },
  },
};

export const CreateCredTranRequestSchema: SchemaObject = {
  type: 'array',
  items: {
    type: 'object',
    required: ['credentialContent'],
    properties: {
      credentialContent: {
        type: 'object',
        properties: {
          evidences: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          geoJSON: {
            type: 'object',
            properties: {},
          },
          credentialSubject: {
            type: 'object',
            properties: {
              code: {
                type: 'string',
              },
              credentialName: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
              batchNo: {
                type: 'string',
              },
              mfgDate: {
                type: 'string',
              },
            },
          },
        },
      },
      extTempId: {
        type: 'string',
      },
      isLocked: {
        type: 'boolean',
      },
      issuerUser: {
        type: 'string',
      },
      credentialTemplate: {
        type: 'string',
      },
    },
  },
};

export const CreateCredTranResponseSchema: SchemaObject = {
  type: 'object',
  title: 'CreateCredTranResponse',
  properties: {
    success: {
      type: 'boolean',
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const CREATE_CRED_TRAN_REQUEST: RequestBodyObject = {
  description: 'Create Cred-Tran Request Body',
  required: true,
  content: {
    'application/json': {schema: CreateCredTranRequestSchema},
  },
};

export const CREATE_CRED_TRAN_RESPONSE: ResponseObject = {
  description: 'Create Cred-Tran Response Object',
  content: {
    'application/json': {
      schema: CreateCredTranResponseSchema,
    },
  },
};
