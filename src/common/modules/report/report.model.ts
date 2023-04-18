/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export enum Status {
  'requested' = 'Requested',
  'available' = 'Available',
}

export interface IReport extends Document {
  reportLink: string;
  filters: mongoose.Schema.Types.Mixed;
  tableName: string;
  status: Status;
  totalEntries: number;
  updatedAt: Date;
  createdAt: Date;
}

/**
 * Schema
 */

export const reportSchema = new Schema(
  {
    reportLink: {type: String, sparse: true, unique: true},
    filters: {
      type: mongoose.Schema.Types.Mixed,
    },
    tableName: {
      type: String,
    },
    status: {
      type: String,
      enum: Status,
    },
    totalEntries: {
      type: Number,
    },
  },
  {timestamps: true},
);

export const Report = mongoose.model<IReport>('report', reportSchema);
