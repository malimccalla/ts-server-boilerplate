import * as faker from 'faker';
import { request } from 'graphql-request';
import { Connection } from 'typeorm';

import { User } from '../../../entity/User';
import { registerMutation } from '../../../test/ast';
import { createTestConn } from '../../../test/createTestConn';

const host = process.env.TEST_HOST as string;
faker.seed(Date.now() + Math.random());

describe('Register', () => {
  const validEmail = faker.internet.email();
  const validPassword = faker.internet.password(10);

  const invalidEmail = 'Invalid email';
  const invalidPassword = faker.internet.password(5);

  describe('Happy path', () => {
    let conn: Connection;

    beforeEach(async () => {
      conn = await createTestConn();
    });

    afterEach(async () => {
      await conn.close();
    });

    test('should return a user on creation', async () => {
      const mutation = registerMutation(validEmail, validPassword);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      const user = await User.findOne({ where: { email: validEmail } });

      expect(register.ok).toBe(true);
      expect(register.user).toBeTruthy();
      expect(register.user!.email).toEqual(validEmail);

      // check password has been hashed
      expect(user!.password).not.toEqual(validPassword);
    });

    test('user should not be confirmed on creation', async () => {
      const mutation = registerMutation(validEmail, validPassword);
      await request(host, mutation);

      const user = await User.findOne({ where: { email: validEmail } });
      expect(user!.confirmed).toBe(false);
    });
  });

  describe('Email validation', () => {
    let conn: Connection;

    beforeEach(async () => {
      conn = await createTestConn();
    });

    afterEach(async () => {
      await conn.close();
    });

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

    test('should not allow duplicate emails', async () => {
      const mutation = registerMutation(validEmail, validPassword);
      await request(host, mutation);
      const { register } = (await request(host, mutation)) as {
        register: GQL.IRegisterResponse;
      };

      expect(register.ok).toBe(false);
      expect(register.errors).toHaveLength(1);
      expect(register.errors).toMatchSnapshot();

      expect(register.errors[0].path).toEqual('email');
      expect(register.errors[0].message).toEqual('Email already in use');
    });
  });

  describe('Password validation', () => {
    let conn: Connection;

    beforeEach(async () => {
      conn = await createTestConn();
    });

    afterEach(async () => {
      await conn.close();
    });

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
