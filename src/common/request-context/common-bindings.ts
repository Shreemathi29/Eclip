/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {BindingKey} from '@loopback/context';
import {Context} from 'vm';
import {UserProfile} from '../modules/users/user.model';
import {DecodedJWTAndUser} from './decode-jwt.provider';

export const CommonBindings = {
  REQUEST: BindingKey.create<Request | undefined>('common-request'),
  RESPONSE: BindingKey.create<Response | undefined>('common-response'),
  JWT: BindingKey.create<string | undefined>('common-jwt'),
  REQUEST_ID: BindingKey.create<string | undefined>('common-request-id'),
  DECODED_JWT: BindingKey.create<UserProfile>('common-decoded-jwt'),
  COMMON_REQ_CTX: BindingKey.create<Context | undefined>('common-request-id'),
  SERVER_NAME: BindingKey.create<string | undefined>('common-Server-name'),
  IP: BindingKey.create<string | undefined>('common-request-ip'),
};

export const DECODED_JWT_AND_USER = BindingKey.create<DecodedJWTAndUser>(
  'providers.DecodedJWTProvider',
);
