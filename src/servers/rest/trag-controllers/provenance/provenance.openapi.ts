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

export const FullProvenanceRequestSchema: SchemaObject = {
  type: 'object',
  required: ['appMode', 'scanType'],
  title: 'GetFullProvenanceRequest',
  properties: {
    barcode: {
      type: 'string',
    },
    fssai: {
      type: 'string',
    },
    mfgDate: {
      type: 'string',
    },
    cakResponse: {
      type: 'object',
      required: [],
      title: 'ks1Response',
      properties: {}, // TODO: fields not decided yet
    },
    isHashGtin: {
      type: 'boolean',
    },
    cakParsedData: {
      type: 'object',
      required: [],
      title: 'cakParsedData',
      properties: {}, // TODO: fields not decided yet
    },
    batch: {type: 'string'},
  },
  additionalProperties: true,
};

export const FullProvenanceResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetFullProvenanceResponse',
  properties: {
    data: {
      type: 'object',
      // TODO: fields not finalize, need to add later
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const StepCredRequestSchema: SchemaObject = {
  type: 'object',
  required: ['gtin', 'credTxId'],
  title: 'GetStepCredRequest',
  properties: {
    gtin: {
      type: 'string',
    },
    credTxId: {
      type: 'string',
    },
  },
};

export const StepCredResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetStepCredResponse',
  properties: {
    data: {
      type: 'object',
      // TODO: fields not finalize, need to add later
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const StepCredBulkRequestSchema: SchemaObject = {
  type: 'object',
  required: ['gtin', 'credTxIds', 'provId'],
  title: 'GetStepCredBulkRequest',
  properties: {
    gtin: {
      type: 'string',
    },
    credTxIds: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    provId: {
      type: 'string',
    },
    userProfile: {
      type: 'object',
    },
  },
};

export const StepCredBulkResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetStepCredBulkResponse',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const ProductCredRequestSchema: SchemaObject = {
  type: 'object',
  required: ['gtin'],
  title: 'GetProductCredRequest',
  properties: {
    gtin: {
      type: 'string',
    },
  },
};

export const ProductCredResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetProductCredResponse',
  properties: {
    data: {
      type: 'object',
      // TODO: fields not finalize, need to add later
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const GET_FULL_PROVENANCE_REQUEST: RequestBodyObject = {
  description: 'Get full provenance request fields',
  required: true,
  content: {
    'application/json': {schema: FullProvenanceRequestSchema},
  },
};

export const GET_FULL_PROVENANCE_RESPONSE: ResponseObject = {
  description: 'Get full provenance response fields',
  content: {
    'application/json': {
      schema: FullProvenanceResponseSchema,
    },
  },
};

export const GET_STEP_CRED_REQUEST: RequestBodyObject = {
  description: 'Get step cred request fields',
  required: true,
  content: {
    'application/json': {schema: StepCredRequestSchema},
  },
};

export const GET_STEP_CRED_RESPONSE: ResponseObject = {
  description: 'Get step cred Response Fields',
  content: {
    'application/json': {
      schema: StepCredResponseSchema,
    },
  },
};

export const GET_STEP_CRED_BULK_REQUEST: RequestBodyObject = {
  description: 'Get step cred bulk request fields',
  required: true,
  content: {
    'application/json': {schema: StepCredBulkRequestSchema},
  },
};

export const GET_STEP_CRED_BULK_RESPONSE: ResponseObject = {
  description: 'Get step cred bulk Response Fields',
  content: {
    'application/json': {
      schema: StepCredBulkResponseSchema,
    },
  },
};

export const GET_PRODUCT_CRED_REQUEST: RequestBodyObject = {
  description: 'Get product cred Request Fields',
  required: true,
  content: {
    'application/json': {schema: ProductCredRequestSchema},
  },
};

export const GET_PRODUCT_CRED_RESPONSE: ResponseObject = {
  description: 'Get product cred Response Fields',
  content: {
    'application/json': {
      schema: ProductCredResponseSchema,
    },
  },
};

export const CREATE_TOS_REQUEST: RequestBodyObject = {
  description: 'createTOSRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['action', 'service_agreement'],
        title: 'signInRequest',
        properties: {
          service_agreement: {type: 'string'},
          action: {
            type: 'string',
            enum: [
              'user_registration',
              'age_verification',
              'client_login',
              'admin_web_app_login',
              'customer_tac',
            ],
          },
          email: {type: 'string'},
          gtin: {type: 'string'},
        },
      },
    },
  },
};

export const CREATE_TOS_RESPONSE: ResponseObject = {
  description: 'createTOSRespose',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'createTOSRespose',
        properties: {
          tos_log: {
            type: 'object',
            properties: {
              date: {type: 'string'},
              ip: {type: 'string'},
              service_agreement: {type: 'object'},
              user_agent: {type: 'object'},
              action: {
                type: 'string',
                enum: [
                  'user_registration',
                  'age_verification',
                  'client_login',
                  'admin_web_app_login',
                  'customer_tac',
                ],
              },
              email: {type: 'string'},
              gtin: {type: 'string'},
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
