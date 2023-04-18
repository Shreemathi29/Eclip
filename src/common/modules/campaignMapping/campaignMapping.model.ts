/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

export interface ICampaignMapping extends Document {
  campaignId: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  variant: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  creatorUser: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Schema
 */
export const campaignMappingSchema = new Schema(
  {
    campaignId: {type: mongoose.Types.ObjectId, required: true},
    item: {type: mongoose.Types.ObjectId},
    variant: {type: mongoose.Types.ObjectId},
    batch: {type: mongoose.Types.ObjectId},
    creatorUser: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {timestamps: true},
);

export const CampaignMapping = mongoose.model<ICampaignMapping>(
  'campaignmapping',
  campaignMappingSchema,
);
