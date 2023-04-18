/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';
/**
 * Interface
 */
export interface ILoginLogs extends Document {
  email: string;
  accessToken: string;
  refreshToken: string;
  givenName?: string;
  familyName?: string;
  fullName?: string;
  role?: string;
}
//--------------------------------------------------

/**
 * Schema
 */
export const LoginLogsSchema = new Schema(
  {
    email: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    givenName: {
      type: String,
    },
    familyName: {
      type: String,
    },
    fullName: {
      type: String,
    },
    role: {type: String},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const LoginLogs = mongoose.model<ILoginLogs>(
  'loginlogs',
  LoginLogsSchema,
);
