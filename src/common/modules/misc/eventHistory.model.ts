/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';
import {
  CreatorType,
  CreatorTypeArray,
} from '../batchLazyBindingParent/batchLazyBindingParent.model';
/**
 * Interface
 */
export interface IEventHistory extends Document {
  batchLazyBindingParentId: mongoose.Types.ObjectId;
  variant: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  eventType: string;
  creatorType: CreatorType;
}
/**
 * Schema
 */
export const eventHistorySchema = new Schema(
  {
    variant: {type: mongoose.Types.ObjectId, index: true},
    batch: {type: mongoose.Types.ObjectId, index: true},
    item: {type: mongoose.Types.ObjectId, index: true},
    createdBy: {type: mongoose.Types.ObjectId, index: true},
    batchLazyBindingParentId: {type: mongoose.Types.ObjectId, index: true},
    creatorType: {type: String, enum: CreatorTypeArray},
    eventType: {type: String},
  },
  {timestamps: true},
);

export const EventHistory = mongoose.model<IEventHistory>(
  'eventHistory',
  eventHistorySchema,
);
