import { gql } from 'apollo-server';
import { request } from 'graphql-request';

const reqisterMutation = (email: any, password: any) => gql`
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
  describe('Email', () => {
    test('should not allow an invalid email', async () => {
      const mutation = reqisterMutation('Invalid email', 'validpassword');
      const { register } = (await request('http://localhost:4000', mutation)) as {
        register: GQL.IRegisterResponse;
      };

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.user).toBeFalsy();
      expect(register.errors).toMatchSnapshot();
    });
  });
});
