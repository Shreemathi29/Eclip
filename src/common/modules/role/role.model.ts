/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

export interface IRole extends Document {
  id: number;
  name: string;
  permissions: {
    action: string | string[];
    subject?: string | string[];
    /** an array of fields to which user has (or not) access */
    fields?: string[];
    /** an object of conditions which restricts the rule scope */
    conditions?: any;
    /** indicates whether rule allows or forbids something */
    inverted?: boolean;
    /** message which explains why rule is forbidden */
    reason?: string;
  }[];
  FENavItems?: Object[];
}

const permissionSchema = new Schema({
  action: {type: Schema.Types.Mixed},
  subject: {type: Schema.Types.Mixed},
  fields: {type: Schema.Types.Mixed},
  conditions: {type: Schema.Types.Mixed},
  inverted: {type: Boolean},
  reason: {type: String},
});

const roleSchema = new Schema(
  {
    id: {type: Number, index: true},
    name: {type: String, unique: true},
    permissions: [permissionSchema],
    FENavItems: [{type: Object}],
  },
  {timestamps: true},
);

export const Role = mongoose.model<IRole>('role', roleSchema);
