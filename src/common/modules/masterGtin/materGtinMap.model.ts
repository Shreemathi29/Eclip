/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */

export interface IMasterGtinMap extends Document {
  masterGtin: string;
  childGtins: string[];
}

const MasterGtinMapSchema = new Schema(
  {
    masterGtin: {type: String, unique: true},
    childGtins: [{type: String, index: true}],
  },
  {timestamps: true},
);

/**
 * Model
 */
export const MasterGtinMap = mongoose.model<IMasterGtinMap>(
  'masterGtinMap',
  MasterGtinMapSchema,
);
