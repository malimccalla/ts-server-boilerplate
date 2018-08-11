import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTestConn } from '../../test/createTestConn';
import { TestClient } from '../../test/TestClient';

faker.seed(Date.now() + Math.random());

describe('Register', () => {
  const password = faker.internet.password(10);

  describe('Happy path', () => {
    let conn: Connection;

    beforeEach(async () => {
      conn = await createTestConn();
    });

    afterEach(async () => {
      await conn.close();
    });

    test('should return a user on creation', async () => {
      const client = new TestClient();
      const email = faker.internet.email();

      const res = await client.register({ email, password });

      const user = await User.findOne({ where: { email } });

      expect(res.register.ok).toBe(true);
      expect(res.register.user).toBeTruthy();
      expect(res.register.user!.email).toEqual(email);

      // check password has been hashed
      expect(user!.password).not.toEqual(password);
    });

    test('user should not be confirmed on creation', async () => {
      const email = faker.internet.email();

      const client = new TestClient();
      await client.register({ email, password });

      const user = await User.findOne({ where: { email } });
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
      const client = new TestClient();
      const email = 'Master Blaster';

      const res = await client.register({ email, password });

      expect(res.register.ok).toBe(false);
      expect(res.register.errors).toHaveLength(1);
      expect(res.register.user).toBeFalsy();
      expect(res.register.errors).toMatchSnapshot();
    });

    test('should not allow duplicate emails', async () => {
      const client = new TestClient();
      const email = faker.internet.email();

      await client.register({ email, password });
      const res = await client.register({ email, password });

      expect(res.register.ok).toBe(false);
      expect(res.register.errors).toHaveLength(1);
      expect(res.register.errors).toMatchSnapshot();

      expect(res.register.errors[0].path).toEqual('email');
      expect(res.register.errors[0].message).toEqual('Email already in use');
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
      const client = new TestClient();
      const email = faker.internet.email();

      const res = await client.register({ email, password: 'Hey Joe' });

      expect(res.register.ok).toBe(false);
      expect(res.register.errors).toHaveLength(1);
      expect(res.register.user).toBeFalsy();
      expect(res.register.errors).toMatchSnapshot();
    });
  });
});
