import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IScanLogDetailed extends Document {
  scanLog: Schema.Types.ObjectId;
  data: any;
}

const ScanLogDetailedSchema = new Schema(
  {
    scanLog: {type: Schema.Types.ObjectId},
    data: {type: Schema.Types.Mixed},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const ScanLogDetailed = mongoose.model<IScanLogDetailed>(
  'scanlogdetailed',
  ScanLogDetailedSchema,
);
