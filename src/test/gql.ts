import { gql } from 'apollo-server';
import { print } from 'graphql';

export const query = {
  me: print(gql`
    query {
      me {
        email
        id
      }
    }
  `),
};

export const mutation = {
  forgotPasswordChange: print(gql`
    mutation ForgotPasswordChangeMutation($input: ForgotPasswordChangeInput!) {
      forgotPasswordChange(input: $input) {
        ok
        errors {
          path
          message
        }
      }
    }
  `),

  logout: print(gql`
    mutation Logout {
      logout
    }
  `),

  login: print(gql`
    mutation Login($input: LoginInput!) {
      login(input: $input) {
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
  `),

  register: print(gql`
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
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
  `),

  sendForgotPasswordEmail: print(gql`
    mutation SendForgotPasswordEmailMutation($input: SendForgotPasswordEmailInput!) {
      sendForgotPasswordEmail(input: $input) {
        ok
        errors {
          message
          path
        }
      }
    }
  `),
};
