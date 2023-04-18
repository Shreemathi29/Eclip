/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

export enum CreatorType {
  'User' = 'User',
  'SAP' = 'SAP',
}
export const CreatorTypeArray = Object.values(CreatorType);
/**
 * Interface
 */
export interface IBatchLazyBindingParent extends Document {
  description?: string;
  dateKey: string;
  counterRef: mongoose.Schema.Types.ObjectId;
  parentId: string;
  createdAt?: Date;
  updatedAt?: Date;
  variant?: mongoose.Types.ObjectId;
  batch?: mongoose.Types.ObjectId;
  item?: mongoose.Types.ObjectId;
  hash: string;
  urlEncodedHash?: string;
  createdBy: string;
  creatorRole: string;
  creatorType: CreatorType;
}

/**
 * Schema
 */

export const batchLazyBindingParentSchema = new Schema(
  {
    description: {type: String},
    dateKey: {type: String},
    counterRef: {type: mongoose.Schema.Types.ObjectId},
    parentId: {type: String},
    variant: {type: mongoose.Types.ObjectId, index: true},
    batch: {type: mongoose.Types.ObjectId, index: true},
    item: {type: mongoose.Types.ObjectId, index: true},
    hash: {type: String},
    createdBy: {type: mongoose.Types.ObjectId},
    creatorRole: {type: String},
    creatorType: {type: String, enum: CreatorTypeArray},
  },
  {timestamps: true},
);

batchLazyBindingParentSchema.index({dateKey: 1, parentId: 1}, {unique: true});

export const BatchLazyBindingParent = mongoose.model<IBatchLazyBindingParent>(
  'batchLazyBindingParent',
  batchLazyBindingParentSchema,
);
