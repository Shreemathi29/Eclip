import mongoose, {Document, Schema} from 'mongoose';

//--------------------------------------------------

/**
 * Schema
 */

export interface ICredTransaction extends Document {
  klefki_id: string;
  recordId: string; // added for sap service handling
  // policyId: string;
  credentialContent: {
    credentialSubject: any;
    geoJSON: any;
    evidences?: string[];
    images: string[];
  };
  credentialTemplate: mongoose.Schema.Types.ObjectId;
  isLocked: boolean;
  issuerUser: mongoose.Types.ObjectId | null;
  extTempId: string;
  createdAt?: string;
}

const CredTransactionSchema = new Schema(
  {
    klefki_id: {type: String, sparse: true, unique: true},
    credentialContent: {
      credentialSubject: {type: mongoose.Schema.Types.Mixed},
      geoJSON: {type: mongoose.Schema.Types.Mixed},
      evidences: [{type: String}],
      images: [{type: String}],
    },
    credentialTemplate: {type: mongoose.Schema.Types.ObjectId, index: true},
    recordId: {type: String}, // added for sap service handling
    isLocked: {type: Boolean, default: false},
    issuerUser: {type: mongoose.Schema.Types.ObjectId, index: true},
    extTempId: {type: String, trim: true},
    // TODO TYPE provisional - actual
  },
  {timestamps: true},
);

export const CredTransaction = mongoose.model<ICredTransaction>(
  'credTransaction',
  CredTransactionSchema,
);
