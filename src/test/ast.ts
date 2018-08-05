import { gql } from 'apollo-server';
import { print } from 'graphql';

export const registerMutation = (email: any, password: any) =>
  print(gql`
  mutation {
    register(email: "${email}", password: "${password}") {
      ok
      user {
        id
        email
      }
      errors {
        path
        message
      }
    }
  }
`);

export const loginMutation = (email: any, password: any) =>
  print(gql`
  mutation {
    login(email: "${email}", password: "${password}") {
      ok
      user {
        id
        email
      }
      errors {
        path
        message
      }
    }
  }
`);

export const meQuery = print(gql`
  query {
    me {
      email
      id
    }
  }
`);
