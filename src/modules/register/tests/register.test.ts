import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../../entity/User';
import { createTestConn } from '../../../test/createTestConn';
import { TestClient } from '../../../test/TestClient';

const host = process.env.TEST_HOST as string;
faker.seed(Date.now() + Math.random());

describe('Register', () => {
  const validEmail = faker.internet.email();
  const validPassword = faker.internet.password(10);

  const invalidEmail = 'Invalid@email';
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
      const client = new TestClient(host);
      const { data } = await client.register(validEmail, validPassword);

      const user = await User.findOne({ where: { email: validEmail } });

      expect(data.register.ok).toBe(true);
      expect(data.register.user).toBeTruthy();
      expect(data.register.user!.email).toEqual(validEmail);

      // check password has been hashed
      expect(user!.password).not.toEqual(validPassword);
    });

    test('user should not be confirmed on creation', async () => {
      const client = new TestClient(host);
      await client.register(validEmail, validPassword);

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
      const client = new TestClient(host);
      const { data } = await client.register(invalidEmail, validPassword);

      expect(data.register.ok).toBe(false);
      expect(data.register.errors).toHaveLength(1);
      expect(data.register.user).toBeFalsy();
      expect(data.register.errors).toMatchSnapshot();
    });

    test('should not allow duplicate emails', async () => {
      const client = new TestClient(host);
      const { data } = await client.register(validEmail, validPassword);

      expect(data.register.ok).toBe(false);
      expect(data.register.errors).toHaveLength(1);
      expect(data.register.errors).toMatchSnapshot();

      expect(data.register.errors[0].path).toEqual('email');
      expect(data.register.errors[0].message).toEqual('Email already in use');
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
      const client = new TestClient(host);
      const { data } = await client.register(validEmail, invalidPassword);

      expect(data.register.ok).toBe(false);
      expect(data.register.errors).toHaveLength(1);
      expect(data.register.user).toBeFalsy();
      expect(data.register.errors).toMatchSnapshot();
    });
  });
});
