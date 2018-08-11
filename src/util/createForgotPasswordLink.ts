import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { forgotPasswordPrefix } from '../constants';

export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const twentyMins = 60 * 20;
  const key = v4();
  await redis.set(`${forgotPasswordPrefix}${key}`, userId, 'ex', twentyMins);

  return { key, link: `${url}/change-password/${key}` };
};
