import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface thirdEyeLog extends Document {
  mfgUrl: string;
  fssaiUrl: string;
  jsonUrl: string;
  data: string;
  email: string;
}

const ThirdEyeLogSchema = new Schema(
  {
    mfgUrl: {type: String},
    fssaiUrl: {type: String},
    jsonUrl: {type: String},
    data: {type: mongoose.Schema.Types.Mixed},
    email: {type: String, index: true},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const ThirdEyeLog = mongoose.model<thirdEyeLog>(
  'thirdEyeLog',
  ThirdEyeLogSchema,
);
