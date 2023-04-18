/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {log} from '@/utils';
import {GlobalBindingKeys} from '@/utils/binding-keys';
import {getServiceName} from '@/utils/loopbackUtils';
import {bind, BindingScope, inject} from '@loopback/core';
import _ from 'lodash';
import NodeCache from 'node-cache';
@bind({scope: BindingScope.SINGLETON})
export class CacheService {
  private cache: NodeCache;
  constructor(
    @inject(GlobalBindingKeys.CACHE_CONFIG) private cacheConfig: any,
  ) {
    this.cache = new NodeCache({
      deleteOnExpire: this.cacheConfig.deleteOnExpire ?? true,
      errorOnMissing: false,
      maxKeys: this.cacheConfig?.maxKeys ?? 5000,
      checkperiod: this.cacheConfig?.checkperiod ?? 60, //expiry check period in secods
    });
  }

  // @debugFunction
  public async set(key: string, obj: any, ttl: number) {
    try {
      const ret = await this.cache.set(key, obj, ttl);
    } catch (err: any) {
      return false;
    }
  }
  // @debugFunction
  public async get(key: string) {
    try {
      const ret: any = await this.cache.get(key);
      return ret;
    } catch (err) {
      return undefined;
    }
  }
}

export function addCache(keyPath: string, ttl?: number) {
  return function (target: any, propertyName: any, descriptor: any) {
    const method = descriptor.value;
    descriptor.value = async function (...args: any) {
      // -------------------------------------------

      // ---------------------------------------------------------

      const cacheService = (await this.ctx?.get(
        getServiceName(CacheService),
      )) as CacheService;

      const cacheConfig = (await this.ctx?.get(
        GlobalBindingKeys.CACHE_CONFIG,
      )) as any;

      if (!cacheService) {
        log.warn(
          `cache Error. class does not have ctx. class ${this.constructor?.name} , propertyName: ${propertyName}`,
        );
        // --------------------------------
        const ret = await method.apply(this, args);
        return ret;
        // -----------------------------
      }

      const mainKey = _.get(args?.[0], keyPath);
      // console.log('args', args);
      // console.log('mainKey', mainKey);
      const isMainKeyString = _.isString(mainKey);
      if (!mainKey || !isMainKeyString) {
        log.warn(
          `cache Error. the provided key for keyPath: ${keyPath} did not resolve to string. class ${this.constructor?.name} , propertyName: ${propertyName}`,
        );
        // --------------------------------
        const ret = await method.apply(this, args);
        return ret;
        // -----------------------------
      }

      const key = `${this.constructor?.name || ''}_${
        propertyName || ''
      }_${mainKey}`;

      // console.log('key', key);
      const data = await cacheService.get(key);
      // console.log('isDataFound', !!data);
      if (!data) {
        // --------------------------------
        // console.log('1', 1);
        const ret = await method.apply(this, args);
        // console.log('ret', ret);
        const isKeySet = await cacheService.set(
          key,
          ret,
          ttl ?? cacheConfig.TTL ?? 600,
        );
        // console.log('isKeySet', isKeySet);
        return ret;
        // --------------------------------
      }
      return data;
    };
  };
}
