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

export const CreateProductRequestSchema: SchemaObject = {
  type: 'object',
  required: [
    'name',
    'description',
    'subtitle',
    'images',
    'website',
    'ingredients',
    'instructions',
    'gtin',
  ],
  title: 'CreateProductRequest',
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    subtitle: {
      type: 'string',
    },
    images: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    website: {
      type: 'string',
    },
    ingredients: {
      type: 'string',
    },
    instructions: {
      type: 'string',
    },
    gtin: {
      type: 'object',
      properties: {
        gtinKey: {
          type: 'string',
        },
        quantity: {
          type: 'string',
        },
        quantityMetric: {
          type: 'string',
        },
        price: {
          type: 'string',
        },
        from: {
          type: 'string',
        },
        desc: {
          type: 'string',
        },
      },
    },
  },
};

export const CreateProductResponseSchema: SchemaObject = {
  type: 'object',
  title: 'CreateProductResponse',
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

export const CREATE_PRODUCT_RESPONSE: ResponseObject = {
  description: 'Create Product Response Fields',
  content: {
    'application/json': {
      schema: CreateProductResponseSchema,
    },
  },
};

export const CREATE_PRODUCT_REQUEST: RequestBodyObject = {
  description: 'Create Product Request fields',
  required: true,
  content: {
    'application/json': {schema: CreateProductRequestSchema},
  },
};

export interface IGtin {
  gtinKey: string;
  quantity: string;
  quantityMetric: string;
  price: string;
  from: string;
  desc: string;
}

export interface IProductRequest {
  name: string;
  description: [{type: String}];
  subtitle: string;
  images: [{type: String}];
  website: string;
  ingredients: string;
  instructions: string;
  gtin: IGtin;
}
