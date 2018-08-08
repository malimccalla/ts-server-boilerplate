import { gql } from 'apollo-server';
import { print } from 'graphql';

export const forgotPasswordChangeMutation = (newPassword: any, key: any) =>
  print(gql`
  mutation {
    forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
      ok
      errors {
        path
        message
      }
    }
  }
`);

export const logoutMutation = print(gql`
  mutation {
    logout
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

export const sendForgotPasswordEmailMutation = (email: any) =>
  print(gql`
  mutation {
    sendForgotPasswordEmail(email: "${email}") {
      ok
      errors {
        message
        path
      }
    }
  }
`);
