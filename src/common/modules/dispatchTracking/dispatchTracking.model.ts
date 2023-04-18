import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IDispatchTracking extends Document {
  provenanceId: mongoose.Types.ObjectId;
  status: string;
  nonIssuedCredTran: mongoose.Types.ObjectId[];
  issuedCredTran: mongoose.Types.ObjectId[];
  errors_list: any[];
  updatedAt?: Date;
  createdAt?: Date;
}

/**
 * Schema
 */

export const dispatchTrackingSchema = new Schema(
  {
    provenanceId: {type: mongoose.Types.ObjectId, required: true},
    status: {type: String},
    nonIssuedCredTran: {type: [mongoose.Types.ObjectId]},
    issuedCredTran: {type: [mongoose.Types.ObjectId]},
    errors_list: [{type: mongoose.Schema.Types.Mixed}],
  },
  {timestamps: true},
);

export const DispatchTracking = mongoose.model<IDispatchTracking>(
  'dispatchTracking',
  dispatchTrackingSchema,
);
