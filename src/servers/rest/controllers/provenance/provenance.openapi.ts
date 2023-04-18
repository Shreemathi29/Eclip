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

export const CreateProvRequestSchema: SchemaObject = {
  type: 'object',
  required: ['gtinKey', 'exciseBatchNo'],
  properties: {
    name: {
      type: 'string',
    },
    plantCode: {
      type: 'string',
    },
    mfgDate: {
      type: 'string',
    },
    creatorUser: {
      type: 'string',
    },
    exciseBatchNo: {
      type: 'string',
    },
    gtinKey: {
      type: 'string',
    },
    provenanceTemplate: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    batchData: {
      type: 'object',
      additionalProperties: true,
    },
    provSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          parentCredTx: {
            type: 'string',
          },
          credTxs: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          title: {
            type: 'string',
          },
          subtitle: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const CreateProvResponseSchema: SchemaObject = {
  type: 'object',
  title: 'CreateProvResponse',
  properties: {
    name: {
      type: 'string',
    },
    creatorUser: {
      type: 'string',
    },
    item: {
      type: 'string',
    },
    batch: {
      type: 'string',
    },
    plantCode: {
      type: 'string',
    },
    mfgDate: {
      type: 'string',
    },
    variant: {
      type: 'string',
    },
    provenanceTemplate: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    provSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          parentCredTx: {
            type: 'string',
          },
          credTxs: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          title: {
            type: 'string',
          },
          subtitle: {
            type: 'string',
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

export const UpdateProvRequestSchema: SchemaObject = {
  type: 'object',
  required: ['credTxArr', 'provId'],
  properties: {
    credTxArr: {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    provId: {
      type: 'string',
    },
  },
};

export const UpdateProvResponseSchema: SchemaObject = {
  type: 'object',
  title: 'UpdateProvResponse',
  properties: {
    name: {
      type: 'string',
    },
    creatorUser: {
      type: 'string',
    },
    item: {
      type: 'string',
    },
    batch: {
      type: 'string',
    },
    plantCode: {
      type: 'string',
    },
    mfgDate: {
      type: 'string',
    },
    variant: {
      type: 'string',
    },
    provenanceTemplate: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    provSteps: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          parentCredTx: {
            type: 'string',
          },
          credTxs: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          title: {
            type: 'string',
          },
          subtitle: {
            type: 'string',
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

export const IssueProvCredResponseSchema: SchemaObject = {
  type: 'object',
  title: 'IssueProvCredResponse',
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

export const IssueProvDispatchCredResponseSchema: SchemaObject = {
  type: 'object',
  title: 'IssueProvDispatchCredResponse',
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

export const CREATE_PROV_REQUEST: RequestBodyObject = {
  description: 'Create Prov Request Body',
  required: true,
  content: {
    'application/json': {schema: CreateProvRequestSchema},
  },
};

export const CREATE_PROV_RESPONSE: ResponseObject = {
  description: 'Create Prov Response Object',
  content: {
    'application/json': {
      schema: CreateProvResponseSchema,
    },
  },
};

export const UPDATE_PROV_REQUEST: RequestBodyObject = {
  description: 'Update Prov Request Body',
  required: true,
  content: {
    'application/json': {schema: UpdateProvRequestSchema},
  },
};

export const UPDATE_PROV_RESPONSE: ResponseObject = {
  description: 'Update Prov Response Object',
  content: {
    'application/json': {
      schema: UpdateProvResponseSchema,
    },
  },
};

export const ISSUE_PROV_CRED_RESPONSE: ResponseObject = {
  description: 'Issue Prov Cred Object',
  content: {
    'application/json': {
      schema: IssueProvCredResponseSchema,
    },
  },
};

export const ISSUE_PROV_DISPATCH_CRED_RESPONSE: ResponseObject = {
  description: 'Issue Prov Dispatch Cred Object',
  content: {
    'application/json': {
      schema: IssueProvDispatchCredResponseSchema,
    },
  },
};

export const PROV_MAP_AND_ISSUE_STEP_CREDS: RequestBodyObject = {
  description: 'provMapAndIssueStepCreds',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['provId'],
        properties: {
          provId: {
            type: 'string',
          },
        },
      },
    },
  },
};

export const PROV_MAP_AND_ISSUE_STEP_CREDS_STEPS: RequestBodyObject = {
  description: 'provMapAndIssueStepCreds',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['provId', 'credIds'],
        properties: {
          provId: {
            type: 'string',
          },
          credIds: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
};

export const PROV_DISPATCH_MAP_AND_ISSUE_STEP_CREDS: RequestBodyObject = {
  description: 'provDispatchMapAndIssueStepCreds',
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['provId', 'credTrans'],
        properties: {
          provId: {
            type: 'string',
          },
          credTrans: {
            type: 'array',
          },
        },
      },
    },
  },
};
