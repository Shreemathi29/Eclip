/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IApplication extends Document {
  name: string;
  creator: mongoose.Types.ObjectId;
  description?: string;
  client_id: string;
  app_logo?: string;
  app_link?: string;
  home_page_link?: string;
  privacy_policy_link?: string;
  TAndC_link?: string;
  callback_url?: string;
  bundles?: mongoose.Types.ObjectId[];
  is_enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CreateApplicationInput = Pick<
  IApplication,
  | 'name'
  | 'description'
  | 'app_link'
  | 'app_logo'
  | 'TAndC_link'
  | 'callback_url'
  | 'privacy_policy_link'
  | 'home_page_link'
>;

/**
 * Schema
 */

export const applicationSchema = new Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    creator: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    description: {type: String},
    client_id: {type: String, required: true, unique: true},
    app_logo: {type: String},
    appLink: {type: String},
    home_page_link: {type: String},
    privacy_policy_link: {type: String},
    TAndC_link: {type: String},
    callback_url: {type: String},
    bundles: [{type: mongoose.Types.ObjectId, index: true}],
    is_enabled: {type: Boolean, default: false},
  },
  {timestamps: true},
);

export const Application = mongoose.model<IApplication>(
  'application',
  applicationSchema,
);
