import { gql } from 'apollo-server';
import { request } from 'graphql-request';
import { host } from '../../../constants';

const registerMutation = (email: any, password: any) => gql`
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
  `;

describe('Register', () => {
  const validEmail = 'tester@mali.com';
  const validPassword = 'superS3Cr7t!';

  const invalidEmail = 'Invalid email';
  const invalidPassword = 'pass123';

  describe('Email validation', () => {
    test('should not allow an invalid email', async () => {
      const mutation = registerMutation(invalidEmail, validPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.user).toBeFalsy();
      expect(register.errors).toMatchSnapshot();
    });
  });

  describe('Password validation', () => {
    test('should not allow a password less than 8 characters', async () => {
      const mutation = registerMutation(validEmail, invalidPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.user).toBeFalsy();
      expect(register.errors).toMatchSnapshot();
    });
  });
});
