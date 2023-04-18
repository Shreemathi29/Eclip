/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {HttpErrors} from '@loopback/rest';
import {Context} from 'vm';
import {CommonBindings, DECODED_JWT_AND_USER} from './common-bindings';
import {DecodedJWTAndUser} from './decode-jwt.provider';

export abstract class RequestCtxAbs {
  protected reqestid?: string;
  protected jwt?: string;
  constructor(
    protected ctx: Context, // @inject(CommonBindings.REQUEST_ID, {optional: true}) // protected reqestid?: string, // @inject(CommonBindings.reqestid, {optional: true}) protected jwt: string, // @inject(CommonBindings.JWT, {optional: true}) // protected jwt?: string,
  ) {
    try {
      this.reqestid = this.ctx.getSync(CommonBindings.REQUEST_ID);
    } catch (err) {
      this.reqestid = undefined;
    }

    try {
      this.jwt = this.ctx.getSync(CommonBindings.JWT);
    } catch (err) {
      this.jwt = undefined;
    }
  } // @inject(CommonBindings.reqestid, {optional: true}) private jwt: string,) {}

  protected async getAccessUser() {
    try {
      const profile = (await this.ctx?.get(
        DECODED_JWT_AND_USER,
      )) as DecodedJWTAndUser;
      return profile;
    } catch (err) {
      throw new HttpErrors.InternalServerError(
        'JWT is not decoded, you are trying to decode jwt for a method which is not tagged for authorization',
      );
    }
  }
}
