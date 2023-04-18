/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope} from '@loopback/core';
const is = require('is_js');

@bind({scope: BindingScope.SINGLETON})
export class PingerService {
  constructor() {}

  async ping(name: string) {
    return {name: `Hello ${name}`};
  }
}
