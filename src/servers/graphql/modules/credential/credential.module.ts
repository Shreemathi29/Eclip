/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {createModule} from 'graphql-modules';
import {gqlCommonResolvers, gqlCommonTypeDefs} from '../gql-common.module';
import {CredentialResolver} from './credential.resolver';
import {Credential} from './credentialtype';

export const CredentialModule = createModule({
  id: 'credential-module',
  dirname: __dirname,
  typeDefs: [Credential, gqlCommonTypeDefs],
  resolvers: [CredentialResolver, gqlCommonResolvers],
  // middlewares: {
  //   '*': {
  //     '*': [
  //       //authenticate(),
  //       // authorizeCustom([ICredentialType.NETWORK_OPERATOR_ADMIN], 'edit'),
  //     ],
  //   },
  // },
});
