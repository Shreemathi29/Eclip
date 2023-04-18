/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
interface ICredTransaction {
  credentialContent: {
    credentialSubject: {type: mongoose.Schema.Types.Mixed};
    geoJSON: {type: mongoose.Schema.Types.Mixed};
    evidences: [{type: string}];
    images: [{type: string}];
  };
  credentialTemplate: {type: mongoose.Schema.Types.ObjectId};
}
export interface IProvenanceTemplate extends Document {
  name: string;
  type: string;
  provSteps: {
    credTxs: [ICredTransaction];
    parentCredTx: ICredTransaction;
    title?: string;
    subtitle?: string;
  }[];
  updatedAt?: Date;
  createdAt?: Date;
}

/**
 * Schema
 */

export const provenanceTemplateSchema = new Schema(
  {
    name: {type: String, sparse: true, trim: true, unique: true},
    type: {type: String},
    provSteps: [
      {
        parentCredTx: {
          credentialContent: {
            credentialSubject: {type: mongoose.Schema.Types.Mixed},
            geoJSON: {type: mongoose.Schema.Types.Mixed},
            evidences: [{type: String}],
            images: [{type: String}],
          },
          credentialTemplate: {
            type: mongoose.Schema.Types.ObjectId,
          },
        },
        credTxs: [
          {
            credentialContent: {
              credentialSubject: {type: mongoose.Schema.Types.Mixed},
              geoJSON: {type: mongoose.Schema.Types.Mixed},
              evidences: [{type: String}],
              images: [{type: String}],
            },
            credentialTemplate: {
              type: mongoose.Schema.Types.ObjectId,
            },
          },
        ],
        title: {type: String},
        subtitle: {type: String},
      },
    ],
  },
  {timestamps: true},
);

export const ProvenanceTemplate = mongoose.model<IProvenanceTemplate>(
  'provenancetemplate',
  provenanceTemplateSchema,
);
