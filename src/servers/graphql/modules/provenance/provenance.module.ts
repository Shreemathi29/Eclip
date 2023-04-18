/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {BatchTypedefs} from '../batch/batch.type';
import {ProductTypedefs} from '../product/product.type';
import {ScanLogTypeDefs} from '../scanLog/scanLog.type';
import {ProvenanceResolver} from './provenance.resolver';
import {ProvenanceTypedefs} from './provenance.type';

export const ProvenanceModule = createModule({
  id: 'provenance-module',
  dirname: __dirname,
  typeDefs: [
    ProvenanceTypedefs,
    BatchTypedefs,
    ProductTypedefs,
    ScanLogTypeDefs,
  ],
  resolvers: [ProvenanceResolver],
});
