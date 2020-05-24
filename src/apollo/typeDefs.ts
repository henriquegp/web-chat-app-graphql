import { gql } from 'apollo-boost';

const typeDefs = gql`
  extend type Mutation {
    setToken(token: String!): Boolean
    logout: Boolean
  }
`;

export default typeDefs;
