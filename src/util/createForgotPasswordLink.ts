import { Redis } from 'ioredis';
import { v4 } from 'uuid';

import { forgotPasswordPrefix } from '../constants';

export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const oneDay = 60 * 60 * 24;
  const key = v4();
  await redis.set(`${forgotPasswordPrefix}${key}`, userId, 'ex', oneDay);

  return { key, link: `${url}/change-password/${key}` };
};
