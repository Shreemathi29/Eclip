/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {ScanLogTypeDefs} from '../scanLog/scanLog.type';
import {SerializationGroupResolver} from './serializationGroup.resolver';
import {SerializationGroupTypedefs} from './serializationGroup.type';

export const SerializationGroupModule = createModule({
  id: 'serializationGroup-module',
  dirname: __dirname,
  typeDefs: [SerializationGroupTypedefs, ScanLogTypeDefs],
  resolvers: [SerializationGroupResolver],
});
