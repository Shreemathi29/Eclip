import mongoose, {Document, Schema} from 'mongoose';

export interface ISDRPersonaTx extends Document {
  sdr: mongoose.Types.ObjectId;
  // sdrPersonaTx: mongoose.Types.ObjectId;
  claims: PersonaClaim[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type PersonaClaim = {
  credentialTemplate: mongoose.Types.ObjectId;
  allowedKeys?: string[];
  allKeysEnabled: boolean;
};
//--------------------------------------------------

/**
 * Schema
 */

export const SDRPersonaTxSchema = new Schema(
  {
    // userResponses: [{email: {type: String, index: true}}],
    sdr: {type: mongoose.Types.ObjectId, unique: true},
    // sdrPersonaTx: {type: mongoose.Types.ObjectId, unique: true},
    claims: [
      {
        credentialTemplate: {type: mongoose.Types.ObjectId, index: true},
        allowedKeys: [{type: String}],
        allKeysEnabled: {type: Boolean},
      },
    ],
  },
  {timestamps: true},
);

SDRPersonaTxSchema.index({updatedAt: 1}, {sparse: true});
SDRPersonaTxSchema.index({createdAt: 1}, {sparse: true});
/**
 * Virtual methods - predicate for schema properties
 */

/**
 * Getter, Setter for schema properties
 */
// credentialSchema.plugin(mongooseLeanVirtuals);
/**
 * Middlewares
 */
// credentialSchema.post('save', function (error: any, doc: any, next: any) {
//   if (error.name === 'MongoError' && error.code === 11000) {
//     next(new Error('the credential already exists'));
//   } else {
//     next(error);
//   }
// });

/**
 * Model
 */
export const SDRPersonaTx = mongoose.model<ISDRPersonaTx>(
  'sdrpersonatx',
  SDRPersonaTxSchema,
);
