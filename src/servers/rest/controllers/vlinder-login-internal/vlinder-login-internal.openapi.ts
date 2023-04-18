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

export const CREATE_USER_REQUEST: RequestBodyObject = {
  description: 'createUserRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email', 'givenName'],
        title: 'createUserRequest',
        properties: {
          email: {type: 'string'},
          givenName: {type: 'string'},
          familyName: {type: 'string'},
          oAuthId: {type: 'string'},
          oAuthProvider: {type: 'string'},
          image: {type: 'string'},
        },
        additionalProperties: false,
      },
    },
  },
};

export const CREATE_USER_RESPONSE: ResponseObject = {
  description: 'createUserResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'createUserResponse',
        properties: {
          user: {
            type: 'object',
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

export const EDIT_USER_REQUEST: RequestBodyObject = {
  description: 'editUserRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email'],
        title: 'editUserRequest',
        properties: {
          email: {type: 'string'},
          givenName: {type: 'string'},
          familyName: {type: 'string'},
          oAuthId: {type: 'string'},
          oAuthProvider: {type: 'string'},
          image: {type: 'string'},
          isVerified: {type: 'boolean'},
          isRegistered: {type: 'boolean'},
        },
        additionalProperties: false,
      },
    },
  },
};

export const EDIT_USER_RESPONSE: ResponseObject = {
  description: 'editUserResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'editUserResponse',
        properties: {
          user: {
            type: 'object',
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

export const GET_USER_BY_EMAIL_REQUEST: RequestBodyObject = {
  description: 'getUserByEmailRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email'],
        title: 'getUserByEmailRequest',
        properties: {
          email: {type: 'string'},
        },
        additionalProperties: false,
      },
    },
  },
};

export const GET_USER_BY_EMAIL_RESPONSE: ResponseObject = {
  description: 'getUserByEmailResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'getUserByEmailResponse',
        properties: {
          user: {
            type: 'object',
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

export const GET_USER_BY_ID_REQUEST: RequestBodyObject = {
  description: 'getUserByIdRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['_id'],
        title: 'getUserByIdRequest',
        properties: {
          _id: {type: 'string'},
        },
        additionalProperties: false,
      },
    },
  },
};

export const GET_USER_BY_ID_RESPONSE: ResponseObject = {
  description: 'getUserByIdResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'getUserByIdResponse',
        properties: {
          user: {
            type: 'object',
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

export const SIGNIN_REQUEST: RequestBodyObject = {
  description: 'signInRequest',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['email'],
        title: 'signInRequest',
        properties: {
          email: {type: 'string'},
        },
        additionalProperties: false,
      },
    },
  },
};

export const SIGNIN_RESPONSE: ResponseObject = {
  description: 'signInResponse',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'signInResponse',
        properties: {
          user: {
            type: 'object',
            properties: {
              accessToken: {type: 'string'},
              refreshToken: {type: 'string'},
              email: {type: 'string'},
              familyName: {type: 'string'},
              givenName: {type: 'string'},
              fullName: {type: 'string'},
              serializedUser: {type: 'string'},
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
