import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IBatch extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  manufactureDate?: Date | string;
  variants: mongoose.Types.ObjectId[];
  item: mongoose.Types.ObjectId;
  creatorUser: mongoose.Types.ObjectId;
  isLocked: boolean;
  promoVideoUrl?: string;
  promoWebsiteUrl?: string;
  promoButtonText1?: string;
  promoButtonText2?: string;
  shelfLife?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Schema
 */

export const batchSchema = new Schema(
  {
    name: {type: String, required: true, trim: true, index: true},
    description: {type: String},
    variants: [{type: mongoose.Types.ObjectId}],
    item: {type: mongoose.Types.ObjectId, required: true, index: true},
    creatorUser: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    promoVideoUrl: {type: String},
    promoWebsiteUrl: {type: String},
    promoButtonText1: {type: String},
    promoButtonText2: {type: String},
    manufactureDate: {type: Date},
    shelfLife: {type: Date, index: true},
    isLocked: {type: Boolean, default: false},
  },
  {timestamps: true},
);
// batchSchema.index({item: 1, name: 1}, {unique: true});
export const Batch = mongoose.model<IBatch>('batch', batchSchema);
