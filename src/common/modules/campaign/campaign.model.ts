/*
 *   Copyright (c) 2022 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import mongoose, {Document, Schema} from 'mongoose';

export enum CampaignStatus {
  'active' = 'active',
  'disabled' = 'disabled',
  'created' = 'created',
}
export interface Title {
  primaryTitle: string;
  secondaryTitle: string;
  text: string;
  textStyle: textStyle;
}

export interface textStyle {
  color: string;
}

export interface Message {
  text: string;
  textStyle: textStyle;
}

export interface Comp {
  uri: string[];
  resizeMode: string;
  posterUri: string;
  content: string;
}

export interface Button {
  color: string;
  shadowColor: string;
  text: string;
  uri: string;
  buttonColor: string;
  titleColor: string;
}

export interface Footer {
  backgroundColor: string;
  smallText: string;
  text: string;
}

export interface TypeProps {
  title: Title;
  message: Message;
  comp: Comp;
  button: Button;
  footer: Footer;
}

export interface CampaignData {
  type: string;
  typeProps: TypeProps;
}

export interface ICampaign extends Document {
  name: string;
  description?: string;
  status: CampaignStatus;
  data: [CampaignData];
  campaignTemplateId: [mongoose.Types.ObjectId];
  creatorUser: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const campaignStatusArray = Object.values(CampaignStatus);

const TextStyleSchema = new Schema({
  color: {type: String},
});

const TitleSchema = new Schema({
  primaryTitle: {type: String},
  secondaryTitle: {type: String},
  text: {type: String},
  textStyle: {type: TextStyleSchema},
});

const MessageSchema = new Schema({
  text: {type: String},
  textStyle: {type: TextStyleSchema},
});

const CompSchema = new Schema({
  uri: [{type: String}],
  resizeMode: {type: String},
  posterUri: {type: String},
  content: {type: String},
});

const ButtonSchema = new Schema({
  color: {type: String},
  shadowColor: {type: String},
  text: {type: String},
  uri: {type: String},
  buttonColor: {type: String},
  titleColor: {type: String},
});

const FooterSchema = new Schema({
  backgroundColor: {type: String},
  smallText: {type: String},
  text: {type: String},
});

const TypePropsSchema = new Schema({
  title: {type: TitleSchema},
  message: {type: MessageSchema},
  comp: {type: CompSchema},
  button: {type: ButtonSchema},
  footer: {type: FooterSchema},
});

/**
 * Schema
 */
export const campaignSchema = new Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    description: {type: String},
    status: {
      type: String,
      enum: campaignStatusArray,
      default: CampaignStatus.created,
      required: true,
    },
    data: [
      {
        type: {type: String},
        typeProps: {type: TypePropsSchema},
      },
    ],
    campaignTemplateId: [{type: mongoose.Types.ObjectId}],
    creatorUser: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {timestamps: true},
);

export const Campaign = mongoose.model<ICampaign>('campaign', campaignSchema);
