import axios from 'axios';
import { Connection } from 'typeorm';

import { User } from '../../../entity/User';
import { loginMutation, meQuery } from '../../../test/ast';
import { createTestConn } from '../../../test/createTestConn';

const host = process.env.TEST_HOST as string;

describe('me', () => {
  const email = 'cookie@email.com';
  const password = 'password123';
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

  // xtest('should not return user if not logged in', async () => {

  // });

  test('get the current user', async () => {
    await axios.post(
      host,
      { query: loginMutation(email, password) },
      { withCredentials: true } // saves cookie
    );

    const response = await axios.post(
      host,
      { query: meQuery },
      { withCredentials: true }
    );

    expect(response.data.data).toMatchSnapshot();
  });
});
