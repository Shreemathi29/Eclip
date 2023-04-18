/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
//@ts-nocheck
import mongoose, {Document, Schema} from 'mongoose';

export interface IPinger extends Document {
  name: string;
  message: string;
  findOneOrCreate?: any;
}

export interface ICreatePinger {
  name: IPinger['name'];
  message: IPinger['message'];
}

export interface IGetPinger {
  name: IPinger['name'];
}

export const PingerSchema = new Schema(
  {
    name: {type: String, unique: true, required: true},
    message: {type: String},
  },
  {timestamps: true},
);

PingerSchema.static(
  'findOneOrCreate',
  async function findOneOrCreate(condition, doc) {
    const one = await this.findOne(condition);
    return one || this.create(doc);
  },
);
export const Pinger = mongoose.model<IPinger>('pinger', PingerSchema);
