import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */
export interface IScanLog extends Document {
  scanType: string;
  scannedHash: string;
  fssai: string;
  productName?: string;
  gtinkey?: string;
  batchNo?: string;
  serialNo?: string;
  tokenId: string | null;
  tokenGroup: string | null;
  scanLookupType: 'tokenId' | 'gtin';
  who?: string;
  ip?: number;
  status?: number;
  purpose?: string;
  mfgDate?: string;
  isTampered?: boolean;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    geoCoordinates?: {type?: string; coordinates?: number[]};
  };
  cakDecryptValues?: {
    serialNo: string;
    batchNo: string;
    // vcNo: string;
    orgNo: string;
    // netOpNo: string;
    parentId?: string;
    shortDate?: string;
  };
  uid?: string;
  tapCount?: number;
  symbology?: string;
  appMode?: 'web' | 'mobile';
  createdAt?: Date;
  updatedAt?: Date;
  isCounterfeit?: boolean;
  isTamperTag?: boolean;
  isSuccess?: boolean;
  isShelfLifeExceeded?: boolean;
  product?: mongoose.Types.ObjectId;
  gtin?: mongoose.Types.ObjectId;
  batch?: mongoose.Types.ObjectId;
  prov: string;
  personaInfo: any;
  duration: number;
  strategy: string;
}

// export interface ICreateInput {
//   password: IScanLog['password'];
//   owner: IScanLog['owner'];
// }

// export interface IUniqueKeys {
//   owner: IScanLog['owner'];
// }

/**
 * Schema
 */
export const geoJsonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    // required: true,
  },
  coordinates: {
    type: [Number],
    // required: true,
  },
});

const ScanLogSchema = new Schema(
  {
    appMode: {type: String},
    scanType: {type: String, trim: true, lowercase: true},
    scannedHash: {type: String},
    duration: {type: Number},
    gtinkey: {type: String, trim: true},
    batchNo: {type: String, trim: true},
    serialNo: {type: String, trim: true},
    tokenId: {type: String, trim: true},
    tokenGroup: {type: String, trim: true},
    scanLookupType: {type: String, enum: ['tokenId', 'gtin']},
    productName: {type: String, trim: true},
    fssai: {type: String, trim: true},
    mfgDate: {type: String},
    who: {type: String},
    ip: {type: String, trim: true},
    uid: {type: String},
    location: {
      geoCoordinates: {
        type: geoJsonSchema,
        default: null,
      },
      country: {type: String},
      region: {type: String},
      city: {type: String},
      type: {type: String},
    },
    status: {type: Number},
    purpose: {type: String},
    isTampered: {type: Boolean},
    tapCount: {type: Number},
    symbology: {type: String},
    isCounterfiet: {type: Boolean, default: false},
    product: {type: mongoose.Types.ObjectId, index: true},
    batch: {type: mongoose.Types.ObjectId, index: true},
    gtin: {type: mongoose.Types.ObjectId, index: true},
    isSuccess: {type: Boolean},
    isShelfLifeExceeded: {type: Boolean},
    cakDecryptValues: {type: mongoose.Schema.Types.Mixed},
    prov: {type: mongoose.Types.ObjectId},
    personaInfo: {type: mongoose.Schema.Types.Mixed},
    strategy: {type: String},
  },
  {timestamps: true},
);

/**
 * Model
 */
export const ScanLog = mongoose.model<IScanLog>('scanLog', ScanLogSchema);

export type GeoLocation = {
  country?: string;
  region?: string;
  city?: string;
  geoCoordinates?: {type?: string; coordinates?: number[]};
  type?: 'ip' | 'geoc';
};
