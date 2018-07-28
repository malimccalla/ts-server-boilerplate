import * as faker from 'faker';
import { request } from 'graphql-request';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { loginMutation, registerMutation } from '../../test/ast';
import { createTestConn } from '../../test/createTestConn';

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
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    const register = registerMutation(email, password);
    await request(host, register);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const login = loginMutation(email, password);
    const res = (await request(host, login)) as {
      login: GQL.ILoginResponse;
    };

    expect(res.login.ok).toBe(true);
    expect(res.login.user!.email).toEqual(email);
  });

  test('should not login a user without email confirmation', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    const register = registerMutation(email, password);
    await request(host, register);

    const login = loginMutation(email, password);
    const res = (await request(host, login)) as {
      login: GQL.ILoginResponse;
    };

    expect(res.login.ok).toBe(false);
    expect(res.login).toMatchSnapshot();
  });

  test('should not login a user with a bad email', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    const register = registerMutation(email, password);
    await request(host, register);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const login = loginMutation('wrong@email.com', password);
    const res = (await request(host, login)) as {
      login: GQL.ILoginResponse;
    };

    expect(res.login.ok).toBe(false);
    expect(res.login.errors[0].path).toEqual('email');
    expect(res.login).toMatchSnapshot();
  });

  test('should not login a user with a bad password', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password(10);

    const register = registerMutation(email, password);
    await request(host, register);

    // Manually confirm the users email address
    await User.update({ email }, { confirmed: true });

    const login = loginMutation(email, 'wrong');
    const res = (await request(host, login)) as {
      login: GQL.ILoginResponse;
    };

    expect(res.login.ok).toBe(false);
    expect(res.login.errors[0].path).toEqual('password');
    expect(res.login).toMatchSnapshot();
  });
});
