/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';
import {geoJsonSchema} from '../scanLog/scanLog.model';

/**
 * Interface
 */

export interface Location {
  country?: string;
  region?: string;
  city?: string;
  geoCoordinates?: {type?: string; coordinates?: number[]};
}
export interface IFeedback extends Document {
  // name?: string;
  // email: string;
  // dob?: string;
  // phoneNumber?: string;
  // anniversaryDate?: string;
  rating?: number;
  comments?: string;
  scanType?: 'barcode' | 'nfc';
  scannedHash?: string;
  gtinKey?: string;
  batchNo?: string;
  serialNo?: string;
  userId?: string;
  ip?: number;
  // status?: number;
  location?: Location;
  appMode?: 'web' | 'mobile';
  productName?: string;
  gtin?: mongoose.Types.ObjectId | null;
  batch?: mongoose.Types.ObjectId | null;
  product?: mongoose.Types.ObjectId | null;
  userName?: string;
  email?: string;
  dateOfBirth: Date;
  anniversaryDate: Date;
  phone: string;
  details: mongoose.Schema.Types.Mixed;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FeedbackWebInput {
  barcodeHash?: string;
  nfcHash?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  email?: string;
  birthDate?: string;
  telephone?: string;
  anniversaryDate?: string;
  rating: number;
  comments?: string;
  gs1Data?: Gs1Data;
  ip?: string;
  location?: Location;
  v2Batch?: string;
}
interface Gs1Data {
  batchNo?: string;
  gtin?: string;
  serialNo?: string;
  actualBatch?: string;
}

export interface FeedbackInput {
  email?: string;
  name?: string;
  contactNo?: string;
  rating: number;
  comments: string;
  barcode: string;
  nfcHash?: string;
  latitude?: number;
  longitude?: number;
  gs1Data?: Gs1Data;
  ip?: string;
}

const FeedbackSchema = new Schema(
  {
    appMode: {type: String},
    rating: {type: Number},
    comments: {type: String},
    scanType: {type: String, trim: true, lowercase: true},
    scannedHash: {type: String, index: true},
    gtinKey: {type: String, trim: true, index: true},
    batchNo: {type: String, trim: true, index: true},
    serialNo: {type: String, trim: true, index: true},
    userId: {type: mongoose.Types.ObjectId, index: true},
    productName: {type: String},
    ip: {type: String, trim: true},
    location: {
      geoCoordinates: {
        type: geoJsonSchema,
        default: null,
      },
      country: {type: String},
      region: {type: String},
      city: {type: String},
      type: {type: String},
    },
    userName: {type: String},
    email: {type: String},
    status: {type: Number},
    gtin: {type: mongoose.Types.ObjectId, index: true},
    batch: {type: mongoose.Types.ObjectId, index: true},
    product: {type: mongoose.Types.ObjectId, index: true},
    dateOfBirth: {type: Date},
    anniversaryDate: {type: Date},
    phone: {type: String},
    details: {type: mongoose.Schema.Types.Mixed},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const Feedback = mongoose.model<IFeedback>('feedback', FeedbackSchema);
