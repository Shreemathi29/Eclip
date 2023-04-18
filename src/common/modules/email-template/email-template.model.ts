import mongoose, {Document, Schema} from 'mongoose';

export enum EmailType {
  ADMIN_INVITATION = 'ADMIN_INVITATION',
  SIGN_UP = 'SIGN_UP',
  HOLDER_INVITATION = 'HOLDER_INVITATION',
  CREDENTIAL_ISSUED = 'CREDENTIAL_ISSUED',
  ASSET_TRANSFERRED_MINTER = 'ASSET_TRANSFERRED_MINTER',
  FEEDBACK_CUSTOMER_EMAIL = 'FEEDBACK_CUSTOMER_EMAIL',
}

export enum EmailPropType {
  'title' = 'title',
  'avatar' = 'avatar',
  'paragraph' = 'paragraph',
  'newline' = 'newline',
  'ruler' = 'ruler',
  'social-icon' = 'social-icon',
  'footer' = 'footer',
  'anchor-button' = 'anchor-button',
  'store' = 'store',
  'property-list' = 'property-list',
  'status-light' = 'status-light',
  'statistics' = 'statistics',
}

export interface EmailBodyComponent {
  id: string;
  type: EmailPropType;
  title?: string;
  size?: number; //font size
  color?: string;
  height?: string;
  src?: string;
  link?: string;
  imageStyle?: any;
  align?: string;
  paragraph?: string[];
  searchWords?: string[];
  filler?: {[k: string]: string | undefined};
  highlightTextColor?: string;
  stores?: {platform: 'ios' | 'android'; url: string}[];
  label?: string;
  style?: any;
  [k: string]: any;
}

//--------------------------------------------------

/**
 * Schema
 */
export interface IEmailTemplate extends Document {
  name: string;
  type: EmailType;
  subject: string;
  template: {data: EmailBodyComponent[]; styleGuide: any};
}

const EmailTemplateSchema = new Schema(
  {
    name: {type: String, unique: true, trim: true},
    type: {type: String},
    subject: {type: String},
    template: {
      data: [mongoose.Schema.Types.Mixed],
      styleGuide: mongoose.Schema.Types.Mixed,
    },
  },
  {timestamps: true, strict: false},
);

export const EmailTemplate = mongoose.model<IEmailTemplate>(
  'emailtemplate',
  EmailTemplateSchema,
);
