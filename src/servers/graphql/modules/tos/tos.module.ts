/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {TOSResolver} from './tos.resolver';
import {TOSTypedefs} from './tos.type';

export const TOSModule = createModule({
  id: 'tos-module',
  dirname: __dirname,
  typeDefs: [TOSTypedefs],
  resolvers: [TOSResolver],
});
