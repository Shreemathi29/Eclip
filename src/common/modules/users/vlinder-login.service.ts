/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {log, pretty} from '@/utils';
import {bind, BindingScope, inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {promisify} from 'util';
import {Role} from '../role/role.model';
import {LoginLogs} from './loginLogs.model';
import {User, UserProfile} from './user.model';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');

// export const TOKEN_SECRET_VALUE = process.env.JWT_AUTH_TOKEN ?? 'jwt9089787';
export const TOKEN_EXPIRES_IN_VALUE =
  defaultConfig?.jwt?.accessTokenExpiresIn ?? undefined;
export const REFRESH_TOKEN_EXPIRES_IN_VALUE =
  defaultConfig?.jwt?.refreshTokenExpiresIn ?? undefined;

interface IEditUserRequest {
  email: string;
  givenName?: string | null;
  familyName?: string | null;
  isVerified?: boolean | null;
  isRegistered?: boolean | null;
  oAuthId?: string | null;
  oAuthProvider?: string | null;
}

@bind({scope: BindingScope.SINGLETON})
export class VlinderLoginCommonService {
  constructor(@inject('env') private envConfig: any) {}

  async findUserByOauthId({oAuthId}: {oAuthId: string}) {
    const user = await User.findOne({oAuthId});
    return user;
  }
  async getUserByEmail({email}: {email: string}) {
    const user: any = await User.findOne({email});
    const userRole = await Role.findOne({_id: user?.role}, {name: 1});
    // attach role
    user.role = userRole;
    return user;
  }
  async getUserById({_id}: {_id: string}) {
    const user = await User.findById(_id);
    return user;
  }

  async signIn({email}: {email: string}) {
    const user = await User.findOne({email});
    if (!user)
      throw new HttpErrors.NotFound(`user not found for email: ${email}`);

    // find user role
    const userRole = await Role.findOne({_id: user?.role});

    const accessToken = await this.generateToken(
      {
        email,
        id: user._id,
        features: user.features,
      },
      false,
    );
    const refreshToken = await this.generateToken(
      {
        email,
        id: user._id,
        // oAuthId,
        features: user.features,
      },
      false,
    );

    log.info(`gateway: trag oauth login success => ${email}`);
    // create entry in loginLogs
    await LoginLogs.create({
      email: user.email,
      accessToken: accessToken,
      refreshToken: refreshToken,
      familyName: user.familyName,
      givenName: user.givenName,
      fullName: user.fullName,
      role: userRole?.name,
    });
    return {
      accessToken,
      refreshToken,
      familyName: user.familyName,
      givenName: user.givenName,
      fullName: user.fullName,
      email: user.email,
      userRole: userRole?.name,
      serializedUser: JSON.stringify(user),
    };
  }

  async createUser(params: any) {
    const user = await User.create(params);
    return user;
  }

  async editUser({
    email,
    familyName,
    givenName,
    isRegistered,
    isVerified,
  }: IEditUserRequest) {
    const params: any = {};
    if (!_.isNil(familyName)) params.familyName = familyName;
    if (!_.isNil(givenName)) params.givenName = givenName;
    if (!_.isNil(isVerified)) params.emailVerified = isVerified;
    if (!_.isNil(isRegistered)) params.isRegistered = isRegistered;
    const user = await User.findOneAndUpdate({email}, params, {new: true});
    log.info(
      `user successfully edited for email: ${email}, params ${pretty(params)}`,
    );
    return user;
  }

  async oAuthSignIn({
    email,
    oAuthProvider,
    oAuthId,
    givenName,
    familyName,
    image,
  }: {
    email?: string;
    oAuthProvider: string;
    oAuthId: string;
    givenName?: string;
    familyName?: string;
    image?: string;
  }) {
    log.info(`gateway: trag oauth login init => ${email}`);
    console.log('email', email);
    try {
      const $set: {
        email?: string;
        givenName?: string;
        familyName?: string;
        image?: string;
        oAuthId?: string;
        oAuthProvider?: string;
      } = {
        givenName,
        familyName,
        image,
        oAuthId,
        oAuthProvider,
        // features: [],
      };

      if (email) $set.email = email;
      const user = await User.findOneAndUpdate(
        {oAuthId},
        {
          $set,
          // $addToSet: {oAuthProviders: {oAuthId, oAuthProvider}},
        },
        {upsert: true, new: true},
      );
      const accessToken = await this.generateToken(
        {
          email,
          id: user._id,
          oAuthId,
          features: user.features,
        },
        false,
      );
      const refreshToken = await this.generateToken(
        {
          email,
          id: user._id,
          oAuthId,
          features: user.features,
        },
        false,
      );
      // this.loginLog.addLoginLog({
      //   email: user.email,
      //   oAuthId: user.oAuthId,
      //   oAuthProvider: user.oAuthProvider,
      //   userId: user._id,
      // });
      log.info(`gateway: trag oauth login success => ${email}`);
      return {accessToken, refreshToken, user};
    } catch (err: any) {
      console.log('err.message', err.message);
      if (err.message?.includes('E11000'))
        throw new HttpErrors[400](
          'Your email is already registered with us. Please use your previous login method Or try resetting your password.',
        );
      throw new HttpErrors.InternalServerError('Oops! something went wrong');
    }
  }

  async generateToken(
    userProfile: UserProfile,
    refreshToken = false,
  ): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token : userProfile is null',
      );
    }
    const userInfoForToken = {
      id: userProfile.id,
      email: userProfile.email,
      features: userProfile.features,
    };
    // Generate a JSON Web Token
    let token: string;
    try {
      token = await signAsync(userInfoForToken, this.envConfig.JWT_AUTH_TOKEN, {
        expiresIn: '24h',
      });
    } catch (error) {
      log.error(
        `error in generating token for type: ${
          refreshToken ? 'RefreshToken' : 'AccessToken'
        } Error: ${pretty(error)}`,
      );
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error}`);
    }

    return token;
  }

  async verifyToken(token?: string) {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;

    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(
        token,
        this.envConfig.JWT_AUTH_TOKEN,
      );
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = decodedToken;
    } catch (error: any) {
      if (error?.name == 'TokenExpiredError') {
        throw new HttpErrors.Unauthorized(
          `You Login session is not valid anymore. Please relogin`,
        );
      }
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }
}
