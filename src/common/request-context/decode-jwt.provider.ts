/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {Ability} from '@casl/ability';
import {inject, Provider, service} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {IRole} from '../modules/role/role.model';
import {IUser, User, UserProfile} from '../modules/users/user.model';
import {VlinderLoginCommonService} from '../modules/users/vlinder-login.service';
import {createAbility} from '../services/app-ability.service';
import {CommonBindings} from './common-bindings';

export interface DecodedJWTAndUser {
  decodedJWT: UserProfile;
  user?: IUser;
  role?: IRole;
  ability?: Ability;
}

export class DecodedJWTProvider
  implements Provider<Promise<DecodedJWTAndUser>>
{
  constructor(
    @service(VlinderLoginCommonService)
    private vlnLoginServ: VlinderLoginCommonService,
    // @inject.context() private ctx: Context,
    @inject(CommonBindings.JWT, {optional: true})
    protected jwt?: string,
  ) {}

  async value() {
    const decodedJWT = await this.vlnLoginServ.verifyToken(this.jwt);
    const user = await User.findOne({email: decodedJWT.email}).populate('role');
    const role = user?.role as IRole;
    if (!user)
      throw new HttpErrors.Unauthorized(
        `user with email ${decodedJWT.email} not found`,
      );
    if (!role)
      throw new HttpErrors.Unauthorized(
        `no role found for user with email ${decodedJWT.email} not found`,
      );
    if (user?.accessForbidden)
      throw new HttpErrors.Forbidden('Access is forbidden');
    return {
      decodedJWT,
      user,
      role,
      ability: createAbility(role.permissions as any),
    };
    // const role = await user?.populate('role');
  }
}
