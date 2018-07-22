import axios from 'axios';
import * as Redis from 'ioredis';
import { v4 } from 'uuid';
import { createConfirmEmailLink } from '../createConfirmEmailLink';

describe('createConfirmEmailLink', () => {
  const redis = new Redis();
  let confirmation: { id: string; link: string };

  beforeAll(async () => {
    const userId = v4();

    confirmation = await createConfirmEmailLink(
      process.env.TEST_HOST as string,
      userId,
      redis
    );
  });

  test('should create an email link', async () => {
    expect(confirmation.link).toMatch(/127.0.0.1:8080\/confirm/);
    expect(confirmation.link).toMatch(confirmation.id);
  });

  test('should respond with "ok" on sending link request', async () => {
    const res = await axios.get(confirmation.link);

    expect(res.data).toEqual('ok');
  });
});
