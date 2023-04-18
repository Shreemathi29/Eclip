/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, config} from '@loopback/core';
import mongoose from 'mongoose';
const is = require('is_js');

@bind({scope: BindingScope.SINGLETON})
export class MongooseService {
  public conn: any;
  private mongoDbUrl: string;
  constructor(@config() mongoDbUrl: string) {
    if (is.not.existy(mongoDbUrl) || is.empty(mongoDbUrl)) {
      throw Error(`MongoDBUrl cannot be empty`);
    }
    this.mongoDbUrl = mongoDbUrl;
  }

  async init() {
    const dbWithoutPassword = this.mongoDbUrl.split('@').pop();
    try {
      if (mongoose.connection.readyState === 0) {
        // mongoose.set('debug', true);
        const conn = await mongoose.connect(this.mongoDbUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
        });
        console.log(`connected to DB => ${dbWithoutPassword}`);
      } else {
        console.log('mongoose db state', mongoose.connection.readyState);
      }
    } catch (err) {
      console.log('error in db connection', err);
    }
  }
}
