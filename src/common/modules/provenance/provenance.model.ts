/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IProvenance extends Document {
  name: string;
  description?: string;
  creatorUser: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  // todo:add variant
  batch: mongoose.Types.ObjectId;
  sapBatchNo: string;
  variant: mongoose.Types.ObjectId;
  plantCode?: string;
  mfgDate?: any;
  provenanceTemplate: mongoose.Types.ObjectId;
  provSteps: {
    credTxs: mongoose.Types.ObjectId[];
    parentCredTx: mongoose.Types.ObjectId;
    // credentialTemplates: mongoose.Types.ObjectId[];

    title?: string;
    subtitle?: string;
  }[];
  updatedAt?: Date;
  createdAt?: Date;
}

/**
 * Schema
 */

export const provenanceSchema = new Schema(
  {
    name: {type: String, sparse: true, trim: true, unique: true},
    creatorUser: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    item: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    batch: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    sapBatchNo: {
      type: String,
    },
    plantCode: {
      type: String,
    },
    mfgDate: {
      type: String,
    },
    variant: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    provenanceTemplate: {
      type: mongoose.Types.ObjectId,
      index: true,
    },

    provSteps: [
      {
        parentCredTx: {
          type: mongoose.Types.ObjectId,
          index: true,
        },
        credTxs: [
          {
            type: mongoose.Types.ObjectId,
            index: true,
          },
        ],
        // credentialTemplates: [{type: mongoose.Types.ObjectId, required: true}],
        title: {type: String},
        subtitle: {type: String},
      },
    ],
    description: {type: String},
    batchData: {type: mongoose.Schema.Types.Mixed},
    isLocked: {type: Boolean, default: false},
  },
  {timestamps: true},
);

export const Provenance = mongoose.model<IProvenance>(
  'provenance',
  provenanceSchema,
);
