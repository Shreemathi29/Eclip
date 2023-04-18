/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/camelcase */
import {RequestBodyObject, ResponseObject, SchemaObject} from '@loopback/rest';
import {Pagination} from '../credential/credential.client.openapi';

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

export const HolderRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'access_token', 'email'],
  title: 'GetHolderRequest',
  properties: {
    client_id: {type: 'string'},
    access_token: {type: 'string'},
    email: {type: 'string'},
  },
};

export const HolderResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetHolderResponse',
  properties: {
    holder: {
      type: 'object',
      required: ['did', 'email'],
      properties: {
        email: {
          type: 'string',
        },
        given_name: {
          type: 'string',
          nullable: true,
        },
        did: {
          type: 'string',
        },
        family_name: {
          type: 'string',
          nullable: true,
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

export const HoldersRequestSchema: SchemaObject = {
  type: 'object',
  title: 'FindHolderRequest',
  required: ['client_id', 'access_token', 'currentPage', 'pageSize'],
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
  title: 'FindHolderResponse',
  properties: {
    holders: {
      type: 'array',
      items: {
        type: 'object',
        required: ['did', 'email'],
        properties: {
          email: {
            type: 'string',
          },
          given_name: {
            type: 'string',
            nullable: true,
          },
          did: {
            type: 'string',
          },
          family_name: {
            type: 'string',
            nullable: true,
          },
          wallet_registered: {
            type: 'string',
          },
        },
      },
    },
    pagination: pagination,
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const GET_HOLDER_REQUEST: RequestBodyObject = {
  description: 'Get Issuer Holder Request Body',
  required: true,
  content: {
    'application/json': {schema: HolderRequestSchema},
  },
};

export const GET_HOLDER_RESPONSE: ResponseObject = {
  description: 'Get Issuer Holder Response Object',
  content: {
    'application/json': {
      schema: HolderResponseSchema,
    },
  },
};

export const GET_HOLDERS_REQUEST: RequestBodyObject = {
  description: 'Find Issuer Holder Request Body',
  required: true,
  content: {
    'application/json': {schema: HoldersRequestSchema},
  },
};

export const GET_HOLDERS_RESPONSE: ResponseObject = {
  description: 'Find Issuer Holder Response Object',
  content: {
    'application/json': {
      schema: HoldersResponseSchema,
    },
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
export interface GetHolderObject {
  email: string;
  given_name?: string;
  family_name?: string;
  did?: string;
  wallet_registered?: boolean;
}

export interface GetHolder {
  holder: GetHolderObject;
}
export interface FindHolders {
  holders: GetHolderObject[];
  pagination: Pagination;
}
