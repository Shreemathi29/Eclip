/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

import {Request} from '@loopback/rest';
import _ from 'lodash';
import {getClientIp} from 'request-ip';

const headers = [
  'x-klefki-d-version',
  'x-device-brand',
  'x-device-manufacturer',
  'x-device-model',
  'x-device-modelid',
  'x-device-os',
  'x-device-os-version',
  'x-device-os-buildid',
  'x-device-type',
  'x-app-id',
  'x-app-name',
  'x-app-version',
  'x-app-build-version',
  'host',
  'origin',
];

export function getRequiredHeaders(request: Request) {
  let filterdHeaders = _.pick(request?.headers, headers);
  filterdHeaders = _.omit(filterdHeaders, ['authentication']);
  const ip = getClientIp(request);
  return {ip, ...filterdHeaders};
}
