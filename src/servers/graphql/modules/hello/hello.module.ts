/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {HelloResolver} from './hello.resolver';
import {Hello} from './hello.type';

export const HelloModule = createModule({
  id: 'hello-module',
  dirname: __dirname,
  typeDefs: [Hello],
  resolvers: [HelloResolver],
});
