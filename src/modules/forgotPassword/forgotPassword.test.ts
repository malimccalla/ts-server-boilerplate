import * as faker from 'faker';
import * as Redis from 'ioredis';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTestConn } from '../../test/createTestConn';
import { TestClient } from '../../test/TestClient';
import { createForgotPasswordLink } from '../../util/createForgotPasswordLink';

const host = process.env.TEST_HOST as string;
faker.seed(Date.now() + Math.random());

describe('Forgot password', () => {
  const email = faker.internet.email();
  const oldPassword = faker.internet.password();
  const newPassword = 'whenDovesCry';
  const redis = new Redis();
  let conn: Connection;
  let userId: string;

  beforeEach(async () => {
    conn = await createTestConn();

    const user = await User.create({
      email,
      password: oldPassword,
      confirmed: true,
    }).save();
    userId = user.id;
  });

  afterEach(async () => {
    await conn.close();
  });

  test('Should set a new password', async () => {
    const client = new TestClient(host);
    const { key } = await createForgotPasswordLink('', userId, redis);

    const { data } = await client.forgotPasswordChange(newPassword, key);
    expect(data.forgotPasswordChange.ok).toBe(true);
  });

  test('Should not set a new password with wrong key', async () => {
    const client = new TestClient(host);

    const { data } = await client.forgotPasswordChange(newPassword, 'purpleRain');
    expect(data.forgotPasswordChange.ok).toBe(false);
  });

  test('Should be able to login with the new password', async () => {
    const client = new TestClient(host);
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange(newPassword, key);
    const { data } = await client.login(email, newPassword);

    expect(data.login.ok).toBe(true);
    expect(data.login.user!.email).toEqual(email);
  });

  test('Should not be able to login with the old password', async () => {
    const client = new TestClient(host);
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange(newPassword, key);
    const { data } = await client.login(email, oldPassword);

    expect(data.login.ok).toBe(false);
    expect(data.login.user).toBeNull();
  });
});
