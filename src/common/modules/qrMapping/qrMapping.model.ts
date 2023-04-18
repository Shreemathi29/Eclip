import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IQRMapping extends Document {
  hash: string;
  batchNo: string;
  code: string;
  serialNo: string;
  metaData: {
    url: string;
    type: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const QRMappingSchema = new Schema(
  {
    hash: {type: String, required: true, unique: true},
    batchNo: {type: String, required: true},
    code: {type: String, required: true, unique: true},
    serialNo: {type: String, required: true},
    metadata: [
      {
        url: String,
        type: String,
      },
    ],
  },
  {timestamps: true},
);

export const QRMapping = mongoose.model<IQRMapping>(
  'qrMapping',
  QRMappingSchema,
);
