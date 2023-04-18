/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {DECODED_JWT_AND_USER} from '@/common/request-context/common-bindings';
import {log, pretty} from './logging';

export function debugFunction(target: any, propertyName: any, descriptor: any) {
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    log.debug(
      `Init==> at ${
        (this as any)?.constructor?.name
      }, propertyName: ${propertyName}. \n args: ${pretty(args)}`,
    );

    const ret = await method.apply(this, args);
    let retValue;
    try {
      const retValue = ret.toJSON();
    } catch (error) {
      retValue = ret;
    }
    log.debug(
      `Finish ==> at ${
        (this as any)?.constructor?.name
      }, propertyName: ${propertyName}. \n return: ${pretty(retValue)}`,
    );

    return ret;
  };
}

// max three retries
export function retryFunction(target: any, propertyName: any, descriptor: any) {
  let count = 3;
  const method = descriptor.value;
  descriptor.value = async function (...args: any) {
    let ret: any = null;
    const userInfo = await this.ctx.get(DECODED_JWT_AND_USER);
    try {
      ret = await method.apply(this, args);
    } catch (error: any) {
      log.info(
        `Recevied error ==> at ${
          (this as any)?.constructor?.name
        }, propertyName: ${method}. \n UserInfo: ${pretty(
          userInfo?.user?.email,
        )}`,
      );
      _retry(method, count, args);
    }
    return ret;
  };
}

export async function _retry(this: any, method: any, count: number, args: any) {
  let ret = null;
  try {
    ret = await method.apply(this, args);
  } catch (err: any) {
    log.info('Error during retry:', err);
    if (count !== 0) {
      count = count - 1;
      log.info(`Retry count = ${count}`);
      _retry(method, count, args);
    }
    if (count == 0) {
      log.info('All retries failed');
      throw err;
    }
  }
  return ret;
}
