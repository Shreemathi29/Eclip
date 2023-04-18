/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {PersonaResolver} from './persona.resolver';
import {PersonaTypedefs} from './persona.type';

export const PersonaModule = createModule({
  id: 'persona-module',
  dirname: __dirname,
  typeDefs: [PersonaTypedefs],
  resolvers: [PersonaResolver],
});
