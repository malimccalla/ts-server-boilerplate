import { Redis } from 'ioredis';

import { redisSessionPrefix, userSessionIdPrefix } from '../constants';
import { Session } from '../types';

export const deleteAllSessionsByUserId = async (
  userId: string,
  redis: Redis,
  session: Session
) => {
  const sessionIds = await redis.lrange(`${userSessionIdPrefix}${userId}`, 0, -1);

  const rPipeline = redis.multi();

  sessionIds.forEach((key: string) => {
    rPipeline.del(`${redisSessionPrefix}${key}`);
  });

  await rPipeline.exec(err => {
    if (err) {
      console.log(err);
    }
  });

  session.destroy(err => {
    if (err) {
      console.log(err);
    }
  });
};
