/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/camelcase */
import {
  CredentialSubject,
  GetCredential,
  Issuer,
} from '@/clients/rest/monarcha.client';
import {VC} from '@/common/modules/networkGraph/graph-generator.helper';
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

export const CreateCredentialRequestSchema: SchemaObject = {
  type: 'object',
  required: [
    'client_id',
    'access_token',
    'credential_name',
    'credential_subject',
    'credential_logo',
    'issuance_date',
    'nonce',
    'webhook',
    'credential_tag',
    'credential_template',
    'externalId',
    'issuer',
  ],
  title: 'CreateCredentialRequestSchema',
  properties: {
    client_id: {
      type: 'string',
    },
    access_token: {
      type: 'string',
    },
    credential_tag: {
      type: 'string',
    },
    externalId: {
      type: 'string',
    },
    issuer: {
      type: 'object',
      title: 'issuer',
      properties: {
        id: {
          type: 'string',
        },
        profile: {
          type: 'object',
          title: 'profile',
          required: ['name', 'type', 'pk', 'alias'],
          properties: {
            name: {
              type: 'string',
            },
            alias: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            type: {
              enum: ['organization', 'thing', 'app', 'person'],
            },
            logo: {
              type: 'string',
            },
            sameAs: {
              type: 'string',
            },
            pk: {
              type: 'string',
            },
          },
        },
      },
    },
    credential_name: {
      type: 'string',
    },
    credential_logo: {
      type: 'string',
    },
    credential_template: {
      type: 'string',
    },
    credential_subject: {
      type: 'object',
      title: 'credential_subject',
      required: ['id', 'alias', 'key'],
      properties: {
        alias: {
          type: 'string',
        },
        key: {
          type: 'string',
        },
        id: {
          type: 'string',
        },
      },
    },
    issuance_date: {
      type: 'string',
    },
    expiration_date: {
      type: 'string',
    },
    evidence: {
      type: 'array',
      items: {
        type: 'object',
        required: [
          'id',
          'evidenceDocument',
          'subjectPresence',
          'documentPresence',
        ],
        properties: {
          id: {type: 'string'},
          type: {type: 'string'}, // TODO:  array of string
          evidenceDocument: {type: 'string'},
          subjectPresence: {enum: ['Physical', 'Digital']},
          documentPresence: {enum: ['Physical', 'Digital']},
        },
      },
    },
    nonce: {
      type: 'string',
    },
    webhook: {
      type: 'string',
    },
  },
};

export const CreateCredentialResponseSchema: SchemaObject = {
  type: 'object',
  title: 'CreateCredentialResponse',
  required: [
    '@context',
    'type',
    'id',
    'credentialStatus',
    'credentialSubject',
    'issuanceDate',
    'issuer',
  ],
  properties: {
    '@context': {
      type: 'string', // TODO: change to string arr
    },
    type: {
      type: 'string', // TODO: change to string arr
    },
    id: {
      type: 'string',
    },
    credentialStatus: {
      type: 'object',
      title: 'credentialStatus',
      required: ['id', 'type'],
      properties: {
        id: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
      },
    },
    credentialSubject: {
      type: 'object',
      title: 'credentialSubject',
      required: ['id', 'alias', 'key'],
      properties: {
        alias: {
          type: 'string',
        },
        key: {
          type: 'string',
        },
        id: {
          type: 'string',
        },
      },
    },
    issuanceDate: {
      type: 'string',
    },
    evidence: {
      type: 'array',
      title: 'evidence',
      items: {
        type: 'object',
        required: [
          'id',
          'evidenceDocument',
          'type',
          'subjectPresence',
          'documentPresence',
        ],
        properties: {
          id: {
            type: 'string',
          },
          evidenceDocument: {
            type: 'string',
          },
          type: {
            type: 'string', // TODO: define string arr
          },
          subjectPresence: {
            type: 'string',
          },
          documentPresence: {
            type: 'string',
          },
        },
      },
    },
    expirationDate: {
      type: 'string',
    },
    issuer: {
      type: 'object',
      title: 'issuer',
      properties: {
        id: {
          type: 'string',
        },
        profile: {
          type: 'object',
          title: 'profile',
          required: ['name', 'type', 'pk', 'alias'],
          properties: {
            name: {
              type: 'string',
            },
            alias: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            type: {
              enum: ['organization', 'thing', 'app', 'person'],
            },
            logo: {
              type: 'string',
            },
            sameAs: {
              type: 'string',
            },
            pk: {
              type: 'string',
            },
          },
        },
      },
    },
    proof: {
      type: 'object',
      title: 'proof',
      required: ['type', 'jwt'],
      properties: {
        type: {
          type: 'string',
        },
        jwt: {
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

export const GetCredentialRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'access_token', 'tag'],
  title: 'GetCredentialRequest',
  properties: {
    client_id: {type: 'string'},
    access_token: {type: 'string'},
    tag: {type: 'string'},
  },
};

export const GetCredentialResponseSchema: SchemaObject = {
  type: 'object',
  title: 'GetCredentialResponse',
  properties: {
    credential: {
      type: 'object',
      required: [
        '@context',
        'type',
        'id',
        'credentialStatus',
        'credentialSubject',
        'issuanceDate',
        'issuer',
      ],
      properties: {
        '@context': {
          type: 'string',
        },
        type: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        id: {
          type: 'string',
        },
        credentialStatus: {
          type: 'object',
          required: ['id', 'type'],
          properties: {
            id: {
              type: 'string',
            },
            type: {
              type: 'string',
            },
          },
        },
        credentialSubject: {
          type: 'object',
          title: 'credentialSubject',
          required: ['id', 'alias', 'key'],
          properties: {
            id: {
              type: 'string',
            },
            alias: {
              type: 'string',
            },
            key: {
              type: 'string',
            },
          },
        },
        issuanceDate: {
          type: 'string',
        },
        evidence: {
          type: 'object',
          required: [
            'id',
            'evidenceDocument',
            'type',
            'subjectPresence',
            'documentPresence',
          ],
          properties: {
            id: {
              type: 'string',
            },
            evidenceDocument: {
              type: 'string',
            },
            subjectPresence: {
              type: 'string',
            },
            documentPresence: {
              type: 'string',
            },
            type: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
        expirationDate: {
          type: 'string',
        },
        issuer: {
          type: 'object',
          required: ['id', 'profile'],
          properties: {
            id: {
              type: 'string',
            },
            profile: {
              type: 'object',
              title: 'profile',
              required: ['name', 'type', 'pk', 'alias'],
              properties: {
                name: {
                  type: 'string',
                },
                alias: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                type: {
                  enum: ['organization', 'thing', 'app', 'person'],
                },
                logo: {
                  type: 'string',
                },
                sameAs: {
                  type: 'string',
                },
                pk: {
                  type: 'string',
                },
              },
            },
          },
        },
        proof: {
          type: 'object',
          title: 'proof',
          required: ['type', 'jwt'],
          properties: {
            type: {
              type: 'string',
            },
            jwt: {
              type: 'string',
            },
          },
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

export const FindCredentialRequestSchema: SchemaObject = {
  type: 'object',
  required: ['client_id', 'access_token', 'currentPage', 'pageSize'],
  title: 'FindCredentialRequest',
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

export const FindCredentialResponseSchema: SchemaObject = {
  type: 'object',
  title: 'FindCredentialResponse',
  properties: {
    credentials: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          '@context': {
            type: 'string',
          },
          type: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          id: {
            type: 'string',
          },
          credentialStatus: {
            type: 'object',
            required: ['id', 'type'],
            properties: {
              id: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
            },
          },
          credentialSubject: {
            type: 'object',
            title: 'credentialSubject',
            required: ['id', 'alias', 'key'],
            properties: {
              id: {
                type: 'string',
              },
              alias: {
                type: 'string',
              },
              key: {
                type: 'string',
              },
            },
          },
          issuanceDate: {
            type: 'string',
          },
          evidence: {
            type: 'object',
            required: [
              'id',
              'evidenceDocument',
              'type',
              'subjectPresence',
              'documentPresence',
            ],
            properties: {
              id: {
                type: 'string',
              },
              evidenceDocument: {
                type: 'string',
              },
              subjectPresence: {
                type: 'string',
              },
              documentPresence: {
                type: 'string',
              },
              type: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
          expirationDate: {
            type: 'string',
          },
          issuer: {
            type: 'object',
            required: ['id', 'profile'],
            properties: {
              id: {
                type: 'string',
              },
              profile: {
                type: 'object',
                title: 'profile',
                required: ['name', 'type', 'pk', 'alias'],
                properties: {
                  name: {
                    type: 'string',
                  },
                  alias: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  type: {
                    enum: ['organization', 'thing', 'app', 'person'],
                  },
                  logo: {
                    type: 'string',
                  },
                  sameAs: {
                    type: 'string',
                  },
                  pk: {
                    type: 'string',
                  },
                },
              },
            },
          },
          proof: {
            type: 'object',
            required: ['type', 'jwt'],
            properties: {
              type: {
                type: 'string',
              },
              jwt: {
                type: 'string',
              },
            },
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

export const CREATE_CREDENTIAL_REQUEST: RequestBodyObject = {
  description: 'Create Credential Request Body',
  required: true,
  content: {
    'application/json': {schema: CreateCredentialRequestSchema},
  },
};

export const CREATE_CREDENTIAL_RESPONSE: ResponseObject = {
  description: 'Create Credential Response Object',
  content: {
    'application/json': {
      schema: CreateCredentialResponseSchema,
    },
  },
};

export const GET_CREDENTIAL_REQUEST: RequestBodyObject = {
  description: 'Get Credential Request Body',
  required: true,
  content: {
    'application/json': {schema: GetCredentialRequestSchema},
  },
};

export const GET_CREDENTIAL_RESPONSE: ResponseObject = {
  description: 'Get Credential Response Object',
  content: {
    'application/json': {
      schema: GetCredentialResponseSchema,
    },
  },
};

export const FIND_CREDENTIAL_REQUEST: RequestBodyObject = {
  description: 'Find Credential Request Body',
  required: true,
  content: {
    'application/json': {schema: FindCredentialRequestSchema},
  },
};

export const FIND_CREDENTIAL_RESPONSE: ResponseObject = {
  description: 'Find Credential Response Object',
  content: {
    'application/json': {
      schema: FindCredentialResponseSchema,
    },
  },
};

export interface ICredentialRequest {
  client_id: string;
  access_token: string;
  tag: string;
}

export interface ICredentialsRequest {
  client_id: string;
  access_token: string;
  currentPage: number;
  pageSize: number;
}

export interface Evidence {
  id: string;
  evidenceDocument: string;
  type: string[];
  subjectPresence: string;
  documentPresence: string;
}

export interface ICreateCredential {
  client_id: string;
  access_token: string;
  credential_name: string;
  credential_logo: string;
  credential_subject: CredentialSubject;
  issuance_date: string;
  expiration_date?: string;
  evidence?: Evidence[];
  nonce: string;
  webhook: string;
  credential_tag: string;
  credential_template: string;
  externalId: string;
  issuer: Issuer;
}
export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
export interface FindCredentialRes {
  credentials: GetCredential[] | VC[];
  pagination: Pagination;
}
