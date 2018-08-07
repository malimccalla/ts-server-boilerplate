import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTestConn } from '../../test/createTestConn';
import { TestClient } from '../../test/TestClient';

const host = process.env.TEST_HOST as string;
faker.seed(Date.now() + Math.random());

describe('Login', () => {
  let conn: Connection;

  beforeEach(async () => {
    conn = await createTestConn();
  });

  afterEach(async () => {
    await conn.close();
  });

  test('should login a user', async () => {
    const client = new TestClient(host);
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    await client.register(email, password);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const { data } = await client.login(email, password);

    expect(data.login.ok).toBe(true);
    expect(data.login.user!.email).toEqual(email);
  });

  test('should not login a user without email confirmation', async () => {
    const client = new TestClient(host);
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    await client.register(email, password);
    const { data } = await client.login(email, password);

    expect(data.login.ok).toBe(false);
    expect(data.login).toMatchSnapshot();
  });

  test('should not login a user with a locked account', async () => {
    const client = new TestClient(host);
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    await client.register(email, password);

    // Manually confirm and lock the users account
    await User.update({ email }, { locked: true, confirmed: true });

    const { data } = await client.login(email, password);

    expect(data.login.ok).toBe(false);
    expect(data.login).toMatchSnapshot();
  });

  test('should not login a user with a bad email', async () => {
    const client = new TestClient(host);
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    await client.register(email, password);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const { data } = await client.login('wrong@email.com', password);

    expect(data.login.ok).toBe(false);
    expect(data.login.errors[0].path).toEqual('email');
    expect(data.login).toMatchSnapshot();
  });

  test('should not login a user with a bad password', async () => {
    const client = new TestClient(host);
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    await client.register(email, password);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const { data } = await client.login(email, 'wrong');

    expect(data.login.ok).toBe(false);
    expect(data.login.errors[0].path).toEqual('password');
    expect(data.login).toMatchSnapshot();
  });
});
