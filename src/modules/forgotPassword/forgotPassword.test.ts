import * as faker from 'faker';
import * as Redis from 'ioredis';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTestConn } from '../../test/createTestConn';
import { TestClient } from '../../test/TestClient';
import { createForgotPasswordLink } from '../../util/createForgotPasswordLink';

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
    const client = new TestClient();
    const { key } = await createForgotPasswordLink('', userId, redis);

    const res = await client.forgotPasswordChange({ newPassword, key });

    expect(res.forgotPasswordChange.ok).toBe(true);
  });

  test('Should not set a new password with wrong key', async () => {
    const client = new TestClient();

    const res = await client.forgotPasswordChange({
      newPassword,
      key: 'purpleRain',
    });

    expect(res.forgotPasswordChange.ok).toBe(false);
    expect(res.forgotPasswordChange).toMatchSnapshot();
  });

  test('Should be able to login with the new password', async () => {
    const client = new TestClient();
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange({ newPassword, key });
    const { data } = await client.login(email, newPassword);

    expect(data.login.ok).toBe(true);
    expect(data.login.user!.email).toEqual(email);
  });

  test('Should not be able to login with the old password', async () => {
    const client = new TestClient();
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange({ newPassword, key });
    const { data } = await client.login(email, oldPassword);

    expect(data.login.ok).toBe(false);
    expect(data.login.user).toBeNull();
  });

  test('Should hash the new password', async () => {
    const client = new TestClient();
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange({ newPassword, key });

    const user = await User.findOne({ where: { id: userId } });

    expect(user!.password).not.toEqual(newPassword);
  });

  test('Should not be able to use the same key twice', async () => {
    const client = new TestClient();
    const { key } = await createForgotPasswordLink('', userId, redis);

    await client.forgotPasswordChange({ newPassword, key });
    const res = await client.forgotPasswordChange({
      newPassword: 'sometimesItSnowsInApril',
      key,
    });

    expect(res.forgotPasswordChange.ok).toBe(false);
  });
});
