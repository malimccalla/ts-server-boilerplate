import { gql } from 'apollo-server';

export default gql`
  type Query {
    hello(name: String): String!
  }
`;
