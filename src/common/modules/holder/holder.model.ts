/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {accessibleFieldsPlugin, accessibleRecordsPlugin} from '@casl/mongoose';
import mongoose, {Schema} from 'mongoose';
/**
 * Interface
 */
export interface IHolder {
  email: string;
  givenName?: string;
  familyName?: string;
  status?: string;
  image?: string;
}

export enum HolderStatus {
  NOT_INVITED = 'notInvited',
  INVITED = 'invited',
  WALLET_REGISTERED = 'walletRegistered',
}

const holderStatusArr = Object.values(HolderStatus);
//--------------------------------------------------

/**
 * Schema
 */

export const HolderSchema = new Schema(
  {
    email: {type: String, unique: true, lowerCase: true, trim: true},
    givenName: {type: String},
    familyName: {type: String},
    status: {
      type: String,
      enum: holderStatusArr,
      default: HolderStatus.INVITED,
    },
    image: {type: String},
  },

  {timestamps: true},
);

HolderSchema.plugin(accessibleFieldsPlugin);
HolderSchema.plugin(accessibleRecordsPlugin);
/**
 * Middlewares
 */

/**
 * Model
 */
export const Holder = mongoose.model<IHolder>('holder', HolderSchema);
