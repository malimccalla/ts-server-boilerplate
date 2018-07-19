import { gql } from 'apollo-server';
import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { User } from '../../../entity/User';
import { startServer } from '../../../server';
import { createTypeormConn } from '../../../util/createTypeormConn';

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
  let host: string;
  let connection: Connection;

  const validEmail = 'tester@mali.com';
  const validPassword = 'superS3Cr7t!';

  const invalidEmail = 'Invalid email';
  const invalidPassword = 'pass123';

  beforeAll(async () => {
    const res = await startServer();
    connection = res.connection;

    host = `http://127.0.0.1:${res.serverInfo.port}`;
  });

  beforeEach(async () => {
    if (!connection.isConnected) {
      connection = await createTypeormConn();
    }
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

    test('should not duplicate emails', async () => {
      const mutation = registerMutation(validEmail, validPassword);
      await request(host, mutation);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.errors).toMatchSnapshot();

      expect(register.errors[0].message).toEqual('Email already in use');
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
