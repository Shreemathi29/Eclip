/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IPersonaAltFieldMap extends Document {
  persona: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  stageData: {keyName: string; displayName: string}[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schema
 */

export const PersonaAltFieldMapSchema = new Schema(
  {
    persona: {type: mongoose.Types.ObjectId, required: true},
    items: {type: [mongoose.Types.ObjectId]},
    stageData: {type: [{keyName: String, displayName: String}]},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const PersonaAltFieldMap = mongoose.model<IPersonaAltFieldMap>(
  'PersonaAltFieldMap',
  PersonaAltFieldMapSchema,
);
