/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */

export interface IFssai extends Document {
  fssaiCode: string;
  plantDesc: string;
  plantCode: string[];
  geoJSON: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const FssaiSchema = new Schema(
  {
    fssaiCode: {type: String, required: true, unique: true, trim: true},
    plantDesc: {type: String},
    plantCode: [{type: String, trim: true}],
    geoJSON: [{type: mongoose.Schema.Types.Mixed}],
  },
  {timestamps: true},
);

/**
 * Model
 */
export const Fssai = mongoose.model<IFssai>('fssai', FssaiSchema);
