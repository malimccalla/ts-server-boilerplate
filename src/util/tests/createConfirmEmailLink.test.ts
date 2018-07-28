import * as Redis from 'ioredis';
import { v4 } from 'uuid';

import { createConfirmEmailLink } from '../createConfirmEmailLink';

describe('createConfirmEmailLink', () => {
  const redis = new Redis();
  let confirmation: { id: string; link: string };
  let userId: string;

  beforeAll(async () => {
    userId = v4();

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

  test('should save the confirmation id to redis', async () => {
    const value = await redis.get(confirmation.id);

    expect(value).toEqual(userId);
  });
});
