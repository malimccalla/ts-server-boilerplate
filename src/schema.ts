import { gql } from 'apollo-server';

export default gql`
  type Query {
    hello(name: String): String!
  }

  type Mutation {
    register(email: String!, password: String!): Boolean!
  }
`;
