/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IBundle extends Document {
  creator: mongoose.Types.ObjectId;
  bundle_id: string;
  title: string;
  description?: string;
  credentials: {
    credential_id: string;
    name: string;
    logo?: string;
    claims?: string[];
  }[];
  consent_methods: string[];
  created_at?: Date;
  updated_at?: Date;
}

export type CreateBundleInput = Pick<
  IBundle,
  'consent_methods' | 'credentials' | 'bundle_id' | 'title' | 'description'
>;

/**
 * Schema
 */

export const bundleSchema = new Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    title: {type: String, required: true, unique: true},
    description: {type: String},
    bundle_id: {
      type: String,
      unique: true,
      index: true,
    },
    credentials: [
      {
        credentialId: {type: String},
        name: {type: String},
        logo: {type: String},
        claims: {type: [String]},
      },
    ],
    consent_methods: [{type: String}],
  },
  {timestamps: true},
);

export const Bundle = mongoose.model<IBundle>('bundle', bundleSchema);
