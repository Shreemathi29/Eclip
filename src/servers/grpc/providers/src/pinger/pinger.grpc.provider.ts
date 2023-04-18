/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {bind, BindingScope, Provider} from '@loopback/core';

const is = require('is_js');

const yaml_config = require('node-yaml-config');
const defaultConfig = yaml_config.load('./src/config/default.config.yml');

@bind({scope: BindingScope.SINGLETON})
export class PingerGRPCProvider implements Provider<any> {
  // constructor(
  //   @inject('services.PingerService')
  //   private pingerService: PingerService,
  // ) {}
  // async ping(
  //   call: ServerUnaryCall<PingRequest>,
  //   callback: sendUnaryData<PingResponse>,
  // ) {
  //   try {
  //     const arg: any = await ping(call.request);
  //     if (arg && is.existy(arg.error)) {
  //       throw Error(`${arg.error?.error_message}`);
  //     }
  //     const res = await this.pingerService?.ping(arg?.name);
  //     return callback(null, res);
  //   } catch (err) {
  //     log.error(`Error caught at PingerGRPCProvider ping ==>${err.message}`);
  //     const {metadata} = this.constructErrorDetails(err);
  //     return callback(
  //       {
  //         name: 'Internal',
  //         // code: err.statusCode || 500,
  //         message: `${err.message}`,
  //         metadata,
  //         stack: err.stack,
  //       },
  //       null,
  //     );
  //   }
  // }
  // private constructErrorDetails(error: Error | HttpErrors.HttpError) {
  //   const metadata = new Metadata();
  //   metadata.add(
  //     'status',
  //     _.toString((error as HttpErrors.HttpError)?.status || '500'),
  //   );
  //   metadata.add('message', error.message);
  //   return {metadata};
  // }
  value() {
    return {
      // ping: this.ping.bind(this),
      // getUserByEmail:this.get
    };
  }
}
