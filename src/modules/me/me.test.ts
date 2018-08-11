import * as faker from 'faker';
import { Connection } from 'typeorm';

import { User } from '../../entity/User';
import { createTestConn } from '../../test/createTestConn';
import { TestClient } from '../../test/TestClient';

faker.seed(Date.now() + Math.random());

describe('me', () => {
  let conn: Connection;
  let email: string;

  const password = faker.internet.password(10);

  beforeEach(async () => {
    conn = await createTestConn();
    email = faker.internet.email();

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
    const client = new TestClient();
    const response = await client.me();

    expect(response.me).toBeNull();
  });

  test('get the current user', async () => {
    const client = new TestClient();
    await client.login({ email, password });

    const res = await client.me();

    expect(res.me).toHaveProperty('id');
    expect(res.me!.email).toEqual(email);
  });
});
