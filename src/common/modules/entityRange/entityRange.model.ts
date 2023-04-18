import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */

export interface IEntityRange extends Document {
  description?: string;
  serializationGroup: mongoose.Types.ObjectId;
  variant: mongoose.Types.ObjectId;
  batch: mongoose.Types.ObjectId;
  item: mongoose.Types.ObjectId;
  lowerBound: number;
  upperBound: number;
  // ---------------------
  offchain?: {
    attributes: any;
    vcTag: string;
  };
  // -------------------
  bulkErrors?: {msg: string; asset: mongoose.Types.ObjectId | null}[];
  noOfRuns?: number;
  isComplete?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const entityRangeSchema = new Schema(
  {
    description: {type: String},
    lowerBound: {type: Number},
    upperBound: {type: Number},
    serializationGroup: {type: mongoose.Types.ObjectId, index: true},
    variant: {type: mongoose.Types.ObjectId, index: true},
    batch: {type: mongoose.Types.ObjectId, index: true},
    item: {type: mongoose.Types.ObjectId, index: true},
    // -----------------------------------------------
    offchain: {
      attributes: {type: mongoose.Schema.Types.Mixed},
      vcTag: {type: String},
    },
    // ------------------------------------------
    isComplete: {type: Boolean, default: false},
    bulkErrors: [
      {
        msg: {type: String},
        asset: mongoose.Types.ObjectId,
      },
    ],
    noOfRuns: {type: Number, default: 0},
  },
  {timestamps: true},
);

export const EntityRange = mongoose.model<IEntityRange>(
  'entityRange',
  entityRangeSchema,
);
