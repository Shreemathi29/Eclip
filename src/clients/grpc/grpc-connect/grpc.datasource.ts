/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {AnyObject, juggler} from '@loopback/repository';

export class GrpcDataSource extends juggler.DataSource {
  // static dataSourceName = 'grpc';

  constructor(
    // @inject('datasources.config.vc_grpc', {optional: true})
    dsConfig: AnyObject,
  ) {
    super(dsConfig);
  }
}
