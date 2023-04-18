/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface ICategory extends Document {
  _id: string;
  name: string;
  label: string;
  iconURL?: string;
  description?: string;
  field1?: string;
  templateIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICategoryUniqueValues = ICategory['name'] | ICategory['_id'];

export interface ICategoryUniqueKeys {
  name: ICategory['name'];
  _id: ICategory['_id'];
}

export interface IEditICategoryInput {
  iconURL?: string;
  description?: string;
  label?: string;
  field1?: string;
  templateIdentifiers: string[];
}

export interface ICategoryCreateInput {
  iconURL?: string;
  description?: string;
  field1?: string;
  label?: string;
  name: string;
}

export interface ICategorySearchInput {
  licencedTemplatesOnly?: boolean;
  licencedTemplatesFor?: 'ISSUER' | 'VERIFIER';
  name?: ICategory['name'];
  _id?: ICategory['_id'];
}
//--------------------------------------------------

/**
 * Schema
 */
export const categorySchema = new Schema(
  {
    name: {
      type: String,
      index: true,
      unique: true,
      required: [true, 'name is required.'],
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    label: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    iconURL: {
      type: String,
      minLength: 3,
      maxLength: 500,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    field1: {
      type: String,
      maxLength: 500,
      trim: true,
    },
    templateIdentifiers: [{type: String}],
  },
  {timestamps: true},
);

/**
 * Virtual methods - predicate for schema properties
 */

/**
 * Getter, Setter for schema properties
 */
// categorySchema.plugin(mongooseLeanVirtuals);
/**
 * Middlewares
 */
categorySchema.post('save', function (error: any, doc: any, next: any) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('the category already exists'));
  } else {
    next(error);
  }
});

/**
 * Model
 */
export const Category = mongoose.model<ICategory>('category', categorySchema);
