/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
import {GraphQLScalarType} from 'graphql';
import gql from 'graphql-tag';
import {GraphQLJSON} from 'graphql-type-json';

const GDate = new GraphQLScalarType({
  name: 'GDate',
  description: 'serialize to date',
  serialize: value => new Date(value).toISOString(),
});

export const gqlCommonTypeDefs = gql`
  scalar JSON
  scalar GDate
  enum SortOrder {
    asc
    desc
  }
`;

export const gqlCommonResolvers = {
  GDate: GDate,
  JSON: GraphQLJSON,
};

// export const GQLCommonModule = createModule({
//   id: 'gql-common-module',
//   dirname: __dirname,
//   typeDefs: [commonTypeDefs],
//   resolvers,
// });
