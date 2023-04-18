/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

export enum TermsAndCondition {
  AGE_VERIFICATION = 'age_verification',
  CLIENT_LOGIN = 'client_login',
  ADMIN_WEB_APP_LOGIN = 'admin_web_app_login',
  USER_REGISTRATION = 'user_registration',
  CUSTOMER_TAC = 'customer_tac',
}

import mongoose, {Document, Schema} from 'mongoose';
export interface ITOSLog extends Document {
  acceptance_date: Date;
  ip: string;
  service_agreement?: any;
  user_agent?: any;
  action: TermsAndCondition;
  email: string;
  gtin: string;
}

const tosSchema = new Schema(
  {
    acceptance_date: {type: Date},
    ip: {type: String},
    service_agreement: {
      type: mongoose.Schema.Types.Mixed,
    },
    user_agent: {
      type: mongoose.Schema.Types.Mixed,
    },
    action: {type: String},
    email: {
      type: String,
    },
    gtin: {
      type: String,
    },
  },
  {timestamps: true},
);

export const TOSLog = mongoose.model<ITOSLog>('tos-log', tosSchema);
