import { gql } from 'graphql-modules';

export const MasterDispatchTableTypedefs = gql`
  extend type Query {
    getMasterDispatchData(
      key: String!
      bucket: String!
      resType: String!
    ): String
  }
`;

