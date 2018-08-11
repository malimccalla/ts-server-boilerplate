import { gql } from 'apollo-server';
import { print } from 'graphql';

export const forgotPasswordChangeMutation = print(gql`
  mutation ForgotPasswordChangeMutation($input: ForgotPasswordChangeInput!) {
    forgotPasswordChange(input: $input) {
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

export const sendForgotPasswordEmailMutation = print(gql`
  mutation SendForgotPasswordEmailMutation($input: SendForgotPasswordEmailInput!) {
    sendForgotPasswordEmail(input: $input) {
      ok
      errors {
        message
        path
      }
    }
  }
`);
