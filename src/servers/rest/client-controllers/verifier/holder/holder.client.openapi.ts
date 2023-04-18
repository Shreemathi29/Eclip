/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/camelcase */
import {RequestBodyObject, ResponseObject, SchemaObject} from '@loopback/rest';

export const ErrorObject: SchemaObject = {
  type: 'object',
  nullable: true,
  properties: {
    error_type: {
      type: 'string',
    },
    error_code: {
      type: 'string',
    },
    error_message: {
      type: 'string',
    },
    display_message: {
      type: 'string',
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

export const HoldersRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'access_token'],
  title: 'GetVerificationHoldersRequest',
  properties: {
    client_id: {
      type: 'string',
    },
    access_token: {
      type: 'string',
    },
    currentPage: {
      type: 'integer',
    },
    pageSize: {
      type: 'integer',
    },
  },
};

export const HoldersResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetVerificationHoldersResponse',
  properties: {
    holders: {
      type: 'array',
      items: {
        type: 'object',
        required: ['did', 'email'],
        properties: {
          given_name: {
            type: 'string',
            nullable: true,
          },
          family_name: {
            type: 'string',
            nullable: true,
          },
          did: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          wallet_registered: {
            type: 'string',
          },
        },
      },
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    pagination: pagination,
    error: ErrorObject,
  },
};

export const HolderRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'access_token', 'email'],
  title: 'GetVerificationHolderRequest',
  properties: {
    client_id: {
      type: 'string',
    },
    access_token: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
  },
};

export const HolderResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetVerificationHolderResponse',
  properties: {
    holder: {
      type: 'object',
      required: ['did', 'email'],
      properties: {
        given_name: {
          type: 'string',
          nullable: true,
        },
        family_name: {
          type: 'string',
          nullable: true,
        },
        did: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        wallet_registered: {
          type: 'string',
        },
      },
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const GET_HOLDERS_RESPONSE: ResponseObject = {
  description: 'Get Holders Data Response Fields',
  content: {
    'application/json': {
      schema: HoldersResponseSchema,
    },
  },
};

export const GET_HOLDERS_REQUEST: RequestBodyObject = {
  description: 'Get Holders data Request fields',
  required: true,
  content: {
    'application/json': {schema: HoldersRequestSchema},
  },
};

export const GET_HOLDER_RESPONSE: ResponseObject = {
  description: 'Get Holder Data Response Fields',
  content: {
    'application/json': {
      schema: HolderResponseSchema,
    },
  },
};

export const GET_HOLDER_REQUEST: RequestBodyObject = {
  description: 'Get Holder data Request fields',
  required: true,
  content: {
    'application/json': {schema: HolderRequestSchema},
  },
};
export interface IHolderRequest {
  client_id: string;
  access_token: string;
  email: string;
}

export interface IHoldersRequest {
  client_id: string;
  access_token: string;
  currentPage: number;
  pageSize: number;
}
