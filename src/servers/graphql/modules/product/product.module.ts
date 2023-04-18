/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {ManufacturerTypedefs} from '../manufacturer/manufacturer.type';
import {VariantTypedefs} from '../variants/variants.type';
import {ProductResolver} from './product.resolver';
import {ProductTypedefs} from './product.type';

export const ProductModule = createModule({
  id: 'product-module',
  dirname: __dirname,
  typeDefs: [ProductTypedefs, VariantTypedefs, ManufacturerTypedefs],
  resolvers: [ProductResolver],
});
