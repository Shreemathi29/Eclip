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

export const AccessTokenRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'secret'],
  title: 'GetAccessTokenRequest',
  properties: {
    client_id: {
      type: 'string',
    },
    secret: {
      type: 'string',
    },
  },
};

export const AccessTokenResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetAccessTokenResponse',
  properties: {
    access_token: {type: 'string'},
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const GET_ACCESS_TOKEN_REQUEST: RequestBodyObject = {
  description: 'Get Access Token Request Fields',
  required: true,
  content: {
    'application/json': {schema: AccessTokenRequestSchema},
  },
};

export const GET_ACCESS_TOKEN_RESPONSE: ResponseObject = {
  description: 'Get Access Token Response Fields',
  content: {
    'application/json': {
      schema: AccessTokenResponseSchema,
    },
  },
};

export interface IAccessTokenInput {
  client_id: string;
  secret: string;
  exp?: string;
}

export interface IAccessTokenOutput {
  access_token: string;
}
