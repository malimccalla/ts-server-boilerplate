import { redisSessionPrefix, userSessionIdPrefix } from '../../constants';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session, redis }) => {
      const { userId } = session;
      if (userId) {
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

        return true;
      }

      return false;
    },
  },
};

export default resolvers;
