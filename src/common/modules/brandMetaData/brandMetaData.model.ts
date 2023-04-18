import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IBrandMetaData extends Document {
  name: string;
  ageVerifcationData: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export const brandMetaDataSchema = new Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    ageVerifcationData: {type: mongoose.Schema.Types.Mixed},
  },
  {timestamps: true},
);

export const BrandMetaData = mongoose.model<IBrandMetaData>(
  'brandMetaData',
  brandMetaDataSchema,
);
