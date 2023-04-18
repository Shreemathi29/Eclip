/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {accessibleFieldsPlugin, accessibleRecordsPlugin} from '@casl/mongoose';
import mongoose, {Document, Schema} from 'mongoose';
import {humanize} from 'uno-js';
import {IRole} from '../role/role.model';
/**
 * Interface
 */
export interface IUser extends Document {
  email: string;
  givenName?: string;
  familyName?: string;
  fullName?: string;
  emailVerified?: boolean;
  accessForbidden?: boolean;
  features?: string[];
  creator: mongoose.Types.ObjectId;
  isRegistered: boolean;
  image?: string;
  oAuthId?: string;
  oAuthProvider?: string;
  organization: mongoose.Types.ObjectId;
  telephone?: string;
  role?: mongoose.Types.ObjectId | IRole;
}

export interface PushToken {
  timeStamp: string;
  pushToken: string;
}

export interface ISignUpUserInput {
  email: IUser['email'];
  features?: IUser['features'];
  creator?: IUser['creator'];
}

export interface IRegisterUserInput {
  email: IUser['email'];
  givenName: IUser['givenName'];
  familyName: IUser['familyName'];
  password: string;
}

export interface ICreateUserInput {
  email: IUser['email'];
  givenName: IUser['givenName'];
  familyName: IUser['familyName'];
  creator: IUser['creator'];
}

export interface IPolicyInput {
  email: IUser['email'];
  feature: string;
  scope: string;
}

export interface IEditUserInput {
  givenName: IUser['givenName'];
  familyName: IUser['familyName'];
  isRegistered?: IUser['isRegistered'];
}

export interface ISearchUserInput {
  email?: IUser['email'];
  givenName?: IUser['givenName'];
  familyName?: IUser['familyName'];
  emailVerified?: IUser['emailVerified'];
  accessForbidden?: IUser['accessForbidden'];
  role?: string;
}

export interface IUserReturnValues {
  email?: IUser['email'];
  givenName?: IUser['givenName'];
  familyName?: IUser['familyName'];
  _id: IUser['_id'];
}

export interface ILogOut {
  email: IUser['email'];
}

export interface IUniqueKeys {
  email: IUser['email'];
  _id: IUser['_id'];
}

export type IUniqueValues = IUser['email'] | IUser['_id'];

export interface UserProfile {
  id: any;
  email?: string;
  features?: string[];
  oAuthId?: string;
}
//--------------------------------------------------

/**
 * Schema
 */
export const UserSchema = new Schema(
  {
    // birthDate: {type: Date},
    telephone: {type: String},
    // anniversaryDate: {type: Date},
    // isSignedUp: {type: Boolean},
    email: {
      type: String,
      unique: true,
      // sparse: true,
      // required: [true, 'Email is required.'],
      lowercase: true,
      trim: true,
      minLength: 5,
      maxLength: 50,
    },
    givenName: {
      type: String,
      sparse: true,
      lowercase: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      get: humaniseStringFunc,
    },
    familyName: {
      type: String,
      sparse: true,
      lowercase: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      get: humaniseStringFunc,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    accessForbidden: {
      type: Boolean,
      default: false,
    },
    // pushTokens: {
    //   type: [
    //     {
    //       did: {type: String, trim: true},
    //       pushToken: {type: String, trim: true},
    //     },
    //   ],
    // },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      sparse: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
      sparse: true,
    },
    image: {type: String},
    oAuthId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    oAuthProvider: {type: String, trim: true},

    role: {type: Schema.Types.ObjectId, ref: 'role'},
  },
  {timestamps: true},
);

/**
 * Getter, Setter for schema properties
 */

function humaniseStringFunc(key: string) {
  let _res = key;
  if (key) {
    _res = humanize(key);
  }
  return _res;
}

/**
 * Virtual methods - predicate for schema properties
 */
UserSchema.virtual('fullName').get(function (this: {
  givenName: string;
  familyName: string;
}) {
  let _fullName;
  if (this.givenName && this.familyName) {
    _fullName = this.givenName + ' ' + this.familyName;
  }
  if (this.givenName && !this.familyName) {
    _fullName = this.givenName;
  }
  if (this.familyName && !this.givenName) {
    _fullName = this.familyName;
  }
  return _fullName;
});

UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
/**
 * Middlewares
 */

/**
 * Model
 */
export const User = mongoose.model<IUser>('user', UserSchema);
