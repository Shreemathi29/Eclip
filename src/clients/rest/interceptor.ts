/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {pretty} from '@/utils';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import _ from 'lodash';

export function catchAxiosError(
  target: any,
  propertyName: any,
  descriptor: any,
) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    try {
      const ret = await method.apply(this, args);
      return ret;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          propertyName,
          config: _.pick(error.config, ['url', 'method', 'data', 'baseURL']),
          msg: error.message,
          respMsgObj: error.response?.data,
        };

        console.error(
          `error at ${
            (this as any)?.constructor?.name
          } propertyName: ${propertyName}, msg${error.message}`,
          errorDetails,
          // pretty(error?.response?.data?.details),
        );

        throw new HttpErrors.InternalServerError(
          `error at ${
            (this as any)?.constructor?.name
          } propertyName: ${propertyName}, msg${error.message},${pretty({
            errorDetails,
          })}`,
        );
      } else {
        throw error;
      }
    }
  };
}
