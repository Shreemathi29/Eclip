import mongoose, {Document, Schema} from 'mongoose';
// import {type} from 'os';
// import {authorize} from '../../interceptors/index';
import {uuid} from 'uuidv4';

/**
 * Interface
 */
export interface ITemplateStyle extends Document {
  // _id: string;
  templateKey: string;
  labelKey: string;
  name: string;
  description: string;
  data: {email?: any; pdf?: any; image?: any};
  logo?: string;
  iconURL?: string;
  createdAt: Date;
  updatedAt: Date;
  extTempId?: string;
  fields: string[];
  zeroFields?: string[];
}

//--------------------------------------------------

export const templateStyleSchema = new Schema(
  {
    templateKey: {
      type: String,
      unique: true,
      trim: true,
      index: true,
      default: uuid(),
    },
    data: {type: mongoose.Schema.Types.Mixed},
    name: {type: String},
    labelKey: {type: String, unique: true, trim: true, index: true},
    description: {type: String},
    logo: {type: String},
    iconURL: {type: String},
    extTempId: {type: String, unique: true, trim: true, sparse: true},
    fields: [{type: String, trim: true}],
    zeroFields: [{type: String, trim: true}],
  },
  {timestamps: true},
);

/**
 * Virtual methods - predicate for schema properties
 */

/**
 * Getter, Setter for schema properties
 */
// templateStyleSchema.plugin(mongooseLeanVirtuals);
/**
 * Middlewares
 */
// templateStyleSchema.post('save', function (error: any, doc: any, next: any) {
//   if (error.name === 'MongoError' && error.code === 11000) {
//     next(new Error('the templateStyle already exists'));
//   } else {
//     next(error);
//   }
// });

/**
 * Model
 */
export const TemplateStyle = mongoose.model<ITemplateStyle>(
  'templateStyle',
  templateStyleSchema,
);
