/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IPersona extends Document {
  name: string;
  sdr: mongoose.Types.ObjectId;
  sdrPersonaTx: mongoose.Types.ObjectId;
  users?: {email: string; name?: string; _id?: mongoose.Types.ObjectId}[];
  createdAt?: Date;
  updatedAt?: Date;
}

// interface;

//--------------------------------------------------

/**
 * Schema
 */

export const PersonaSchema = new Schema(
  {
    name: {type: String, required: true, unique: true, trim: true},
    sdr: {type: mongoose.Types.ObjectId},
    sdrPersonaTx: {type: mongoose.Types.ObjectId, index: true},
    users: [
      {
        email: {type: String, index: true, lowercase: true, trim: true},
        name: {type: String},
      },
    ],
  },
  {timestamps: true},
);

PersonaSchema.index({updatedAt: 1}, {sparse: true});
PersonaSchema.index({createdAt: 1}, {sparse: true});
/**
 * Virtual methods - predicate for schema properties
 */

/**
 * Getter, Setter for schema properties
 */
// credentialSchema.plugin(mongooseLeanVirtuals);
/**
 * Middlewares
 */
// credentialSchema.post('save', function (error: any, doc: any, next: any) {
//   if (error.name === 'MongoError' && error.code === 11000) {
//     next(new Error('the credential already exists'));
//   } else {
//     next(error);
//   }
// });

/**
 * Model
 */
export const Persona = mongoose.model<IPersona>('persona', PersonaSchema);
