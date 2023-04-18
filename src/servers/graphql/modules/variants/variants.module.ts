/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {BatchTypedefs} from '../batch/batch.type';
import {ProductTypedefs} from '../product/product.type';
import {VariantResolver} from './variants.resolver';
import {VariantTypedefs} from './variants.type';

export const VariantModule = createModule({
  id: 'variant-module',
  dirname: __dirname,
  typeDefs: [VariantTypedefs, BatchTypedefs, ProductTypedefs],
  resolvers: [VariantResolver],
});
