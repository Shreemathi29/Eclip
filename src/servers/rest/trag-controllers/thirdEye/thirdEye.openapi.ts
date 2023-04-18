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

export const UPLOAD_THIRDEYE_LOG_REQUEST: RequestBodyObject = {
  description: 'uploadThirdEyeLogRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',

        title: 'uploadThirdEyeLogRequest',
        properties: {
          fssaiImg: {type: 'string'},
          mfgImg: {
            type: 'string',
          },
          data: {type: 'object', additionalProperties: true},
        },
      },
    },
  },
};

export const UPLOAD_THIRDEYE_LOG_RESPONSE: ResponseObject = {
  description: 'uploadThirdEyeLogRespose',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'uploadThirdEyeLogRespose',
        properties: {
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
