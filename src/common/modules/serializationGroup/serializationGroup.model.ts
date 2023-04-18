import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export enum Status {
  'requested' = 'Requested',
  'available' = 'Available',
  'failed' = 'Failed',
}
export interface ISerializationGroup extends Document {
  description?: string;
  batchNo: number;
  status?: Status;
  maxItems: number;
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const serializationGroupSchema = new Schema(
  {
    description: {type: String},
    batchNo: {type: Number, required: true, unique: true},
    maxItems: {type: Number, required: true},
    link: {type: String},
    status: {
      type: String,
      enum: Status,
    },
  },
  {timestamps: true},
);

export const SerializationGroup = mongoose.model<ISerializationGroup>(
  'serializationGroup',
  serializationGroupSchema,
);
