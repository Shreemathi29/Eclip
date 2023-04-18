/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

//--------------------------------------------------

/**
 * Schema
 */
export interface ICredHash extends Document {
  hash: string;
}

const CredHashSchema = new Schema(
  {hash: {index: true, type: String}, num: {type: Number}},
  {timestamps: true},
);

export const CredHash = mongoose.model<ICredHash>('credHash', CredHashSchema);
