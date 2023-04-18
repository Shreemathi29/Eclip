import mongoose, {Document, Schema} from 'mongoose';

/**
 * Interface
 */

export interface IEncodedLogs extends Document {
  interfaceType: 'barcode' | 'nfc';
  hash: string;
  uid?: string;
  serialIdentifier: string;
  serializationGroupNo?: string;
  entityRangeSlNo?: string;
  creatorUser: string;
  creatorEmail: string;
  batchId: mongoose.Types.ObjectId;
  gtinId: mongoose.Types.ObjectId;
  organization?: string | null;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    geoCoordinates?: {type?: string; coordinates?: number[]};
  };
  ip: string;
  appMode?: 'web' | 'mobile';
  env: 'prod' | 'dev';
  isSuccess: boolean;
  failureMessage?: string;
  NFCTagType: 'tamper' | 'normal';
}

// export interface ICreateInput {
//   password: IEncodedLogs['password'];
//   owner: IEncodedLogs['owner'];
// }

// export interface IUniqueKeys {
//   owner: IEncodedLogs['owner'];
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

const EncodedLogsSchema = new Schema(
  {
    appMode: {type: String},
    // scannedHash: {type: String, sparse: true},
    interfaceType: {type: String, trim: true},
    NFCTagType: {type: String, trim: true},
    serialIdentifier: {type: String, trim: true, sparse: true},
    serializationGroupNo: {type: String, trim: true, index: true},
    entityRangeSlNo: {type: String, trim: true, index: true},
    // batchNo: {type: String, trim: true, sparse: true},
    // serialNo: {type: String, trim: true, sparse: true},
    uid: {type: String, sparse: true},
    creatorUser: {type: mongoose.Types.ObjectId, sparse: true},
    creatorEmail: {type: String},
    organization: {type: mongoose.Types.ObjectId, sparse: true},
    env: {type: String},
    hash: {type: String},
    failureMessage: {type: String},
    ip: {type: String},
    isSuccess: {type: Boolean},
    batchId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    gtinId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
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
  },
  {timestamps: true},
);

// EncodedLogsSchema.post('save', function (error: any, doc: any, next: any) {
// 	console.log('error.message', error.message);
// 	if (error.name === 'MongoError' && error.code === 11000) {
// 		next(new Error('You are already enrolled!'));
// 	} else {
// 		next(error);
// 	}
// });

/**
 * Model
 */
export const EncodedLogs = mongoose.model<IEncodedLogs>(
  'encodedLogs',
  EncodedLogsSchema,
);
