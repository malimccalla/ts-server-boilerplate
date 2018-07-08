import { gql } from 'apollo-server';
import { request } from 'graphql-request';
import { host } from '../../../constants';
import { createTypeormConn } from '../../../util/createTypeormConn';
import { Connection } from 'typeorm';
import { User } from '../../../entity/User';

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

  let connection: Connection;

  beforeEach(async () => {
    connection = await createTypeormConn();
  });

  afterEach(async () => {
    await connection.close();
  });

  describe('Happy path', () => {
    test('should return a user on creation', async () => {
      const mutation = registerMutation(validEmail, validPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      const user = await User.findOne({ where: { email: validEmail } });
      const userCount = await User.count();

      expect(register.ok).toBe(true);
      expect(register.user).toBeTruthy();
      expect(register.user!.email).toEqual(validEmail);
      expect(userCount).toBe(1);

      // check password has been hashed
      expect(user!.password).not.toEqual(validPassword);
    });
  });

  describe('Email validation', () => {
    test('should not allow an invalid email', async () => {
      const mutation = registerMutation(invalidEmail, validPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      const userCount = await User.count();

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.user).toBeFalsy();
      expect(register.errors).toMatchSnapshot();

      expect(userCount).toBe(0);
    });
  });

  describe('Password validation', () => {
    test('should not allow a password less than 8 characters', async () => {
      const mutation = registerMutation(validEmail, invalidPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      const userCount = await User.count();

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.user).toBeFalsy();
      expect(register.errors).toMatchSnapshot();

      expect(userCount).toBe(0);
    });
  });
});
