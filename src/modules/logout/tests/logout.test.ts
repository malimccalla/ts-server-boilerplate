import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../../entity/User';
import { createTestConn } from '../../../test/createTestConn';
import { TestClient } from '../../../test/TestClient';

faker.seed(Date.now() + Math.random());

describe('logout', () => {
  const email = faker.internet.email();
  const password = faker.internet.password();
  let conn: Connection;

  beforeEach(async () => {
    conn = await createTestConn();

    await User.create({
      email,
      password,
      confirmed: true,
    }).save();
  });

  afterEach(async () => {
    await conn.close();
  });

  test('logout a user', async () => {
    const client = new TestClient();
    await client.login(email, password);
    const { data } = await client.me();

    expect(data.me).toHaveProperty('email');
    expect(data.me).toHaveProperty('id');

    const res = await client.logout();
    const res2 = await client.me();

    expect(res.data.logout).toBe(true);
    expect(res2.data.me).toBeNull();
  });

  test('should logout multiple sessions', async () => {
    const session1 = new TestClient();
    const session2 = new TestClient();

    await session1.login(email, password);
    await session2.login(email, password);

    // this logging out of one sesison should log out all sessions
    await session1.logout();

    const sess1User = await session1.me();
    const sess2User = await session2.me();

    expect(sess1User).toEqual(sess2User);
  });
});
