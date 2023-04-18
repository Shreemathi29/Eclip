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

export const CreateFeedbackRequestSchema: SchemaObject = {
  type: 'object',
  required: ['rating', 'userName', 'email', 'dateOfBirth'],
  title: 'CreateFeedbackRequest',
  properties: {
    appMode: {
      enum: ['mobile', 'web'],
    },
    rating: {
      type: 'number',
    },
    comments: {
      type: 'string',
    },
    scanType: {
      enum: ['barcode', 'nfc'],
    },
    scannedHash: {
      type: 'string',
    },
    gtin: {
      type: 'string',
    },
    batchNo: {
      type: 'string',
    },
    serialNo: {
      type: 'string',
    },
    lat: {
      type: 'string',
    },
    lon: {
      type: 'string',
    },
    dateOfBirth: {
      type: 'string',
    },
    anniversaryDate: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    userName: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    details: {
      type: 'object',
    },
    // userId: {
    //   type: 'string',
    // },
    // productName: {
    //   type: 'string',
    // },
    // ip: {
    //   type: 'string',
    // },
    // location: {
    //   type: 'object',
    //   properties: {
    //     country: {
    //       type: 'string',
    //     },
    //     region: {
    //       type: 'string',
    //     },
    //     city: {
    //       type: 'string',
    //     },
    //     geoCoordinates: {
    //       type: 'object',
    //       properties: {
    //         type: {
    //           enum: ['Point'],
    //         },
    //         coordinates: {
    //           type: 'array',
    //           items: {
    //             type: 'number',
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    // userName: {
    //   type: 'string',
    // },
    // email: {
    //   type: 'string',
    // },
    // status: {
    //   type: 'integer',
    // },
    // gtin: {
    //   type: 'string',
    // },
    // batch: {
    //   type: 'string',
    // },
    // product: {
    //   type: 'string',
    // },
  },
};

export const CreateFeedbackResponseSchema: SchemaObject = {
  type: 'object',
  //required: [], TODO: ask for req fields.
  title: 'CreateFeedbackResponse',
  properties: {
    data: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
        },
        appMode: {
          type: 'string',
        },
        rating: {
          type: 'number',
        },
        comments: {
          type: 'string',
        },
        scanType: {
          type: 'string',
        },
        scannedHash: {
          type: 'string',
        },
        gtin: {
          type: 'string',
        },
        batchNo: {
          type: 'string',
        },
        serialNo: {
          type: 'string',
        },
        userId: {
          type: 'string',
        },
        productName: {
          type: 'string',
        },
        ip: {
          type: 'string',
        },
        location: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
            },
            region: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            geoCoordinates: {
              type: 'object',
              properties: {
                _id: {type: 'string'},
                type: {
                  enum: ['Point'],
                },
                coordinates: {
                  type: 'array',
                  items: {
                    type: 'number',
                  },
                },
              },
            },
          },
        },
        userName: {
          type: 'string',
        },
        details: {
          type: 'object',
        },
        email: {
          type: 'string',
        },
        status: {
          type: 'integer',
        },
        gtinKey: {
          type: 'string',
        },
        batch: {
          type: 'string',
        },
        product: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
        },
        updatedAt: {
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

export const CREATE_FEEDBACK_REQUEST: RequestBodyObject = {
  description: 'Get create feedback request fields',
  required: true,
  content: {
    'application/json': {schema: CreateFeedbackRequestSchema},
  },
};

export const CREATE_FEEDBACK_RESPONSE: ResponseObject = {
  description: 'Get create feedback response fields',
  content: {
    'application/json': {
      schema: CreateFeedbackResponseSchema,
    },
  },
};
