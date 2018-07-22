import { Redis } from 'ioredis';
import { v4 } from 'uuid';

export const createConfirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const oneDay = 60 * 60 * 24;
  const id = v4();
  await redis.set(id, userId, 'ex', oneDay);

  return `${url}/confirm/${id}`;
};
