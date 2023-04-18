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

export const MaplocationRequestSchema: SchemaObject = {
  type: 'object',
  required: ['city', 'zipcode'],
  title: 'MapLocationRequest',
  properties: {
    city: {
      type: 'string',
    },
    zipcode: {
      type: 'string',
    },
  },
};

export const MapLocationResponseSchema: SchemaObject = {
  type: 'object',
  title: 'MapLocationResponse',
  properties: {
    formattedAddress: {
      type: 'string',
    },
    latitude: {
      type: 'number',
    },
    longitude: {
      type: 'number',
    },
    zipcode: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    countryCode: {
      type: 'string',
    },
    provider: {
      type: 'string',
    },
    request_id: {
      type: 'string',
      nullable: true,
    },
    error: ErrorObject,
  },
};

export const MAP_LOCATION_RESPONSE: ResponseObject = {
  description: 'Map Location Response Fields',
  content: {
    'application/json': {
      schema: MapLocationResponseSchema,
    },
  },
};

export const MAP_LOCATION_REQUEST: RequestBodyObject = {
  description: 'Map Location Request fields',
  required: true,
  content: {
    'application/json': {schema: MaplocationRequestSchema},
  },
};

export interface IMapLocationRequest {
  city: string;
  zipcode: string;
}
