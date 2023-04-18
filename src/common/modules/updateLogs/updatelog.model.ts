import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IUpdateLog extends Document {
  opName: string;
  before: string;
  after: string;
  who: string;
  user: mongoose.Schema.Types.ObjectId;
  metaData: {
    id: mongoose.Schema.Types.ObjectId;
    id2: mongoose.Schema.Types.ObjectId;
  };
}

//--------------------------------------------------

export const updateLogSchema = new Schema(
  {
    opName: {type: String},
    before: {type: mongoose.Schema.Types.Mixed},
    after: {type: mongoose.Schema.Types.Mixed},
    metaData: {
      id: mongoose.Schema.Types.ObjectId,
      id2: mongoose.Schema.Types.ObjectId,
    },
    who: {type: String},
    user: {type: mongoose.Schema.Types.ObjectId, index: true},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const UpdateLog = mongoose.model<IUpdateLog>(
  'updateLog',
  updateLogSchema,
);
