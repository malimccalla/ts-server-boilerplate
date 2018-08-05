import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../../entity/User';
import { createTestConn } from '../../../test/createTestConn';
import { TestClient } from '../../../test/TestClient';

const host = process.env.TEST_HOST as string;
faker.seed(Date.now() + Math.random());

describe('me', () => {
  const email = faker.internet.email();
  const password = faker.internet.password(10);
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

  test('should return null if no cookie', async () => {
    const client = new TestClient(host);
    const response = await client.me();

    expect(response.data.me).toBeNull();
  });

  test('get the current user', async () => {
    const client = new TestClient(host);
    await client.login(email, password);

    const res = await client.me();

    expect(res.data.me).toHaveProperty('id');
    expect(res.data.me.email).toEqual(email);
  });
});
