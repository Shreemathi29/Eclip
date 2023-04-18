import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */

export interface ILateBindingCounter extends Document {
  counter: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export const lateBindingCounterSchema = new Schema(
  {
    counter: {type: Number, default: 0},
    dateKey: {type: String}, // add compound index (both and unique)
    type: {type: String}, // add compound index
  },
  {timestamps: true},
);

export const LateBindingCounter = mongoose.model<ILateBindingCounter>(
  'lateBindingCounter',
  lateBindingCounterSchema,
);
