import { ResolverMap } from '../../types';
import { deleteAllSessionsByUserId } from '../../util/deleteAllSessionsByUserId';

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session, redis }): Promise<boolean> => {
      const { userId } = session;
      if (userId) {
        await deleteAllSessionsByUserId(userId, redis, session);

        return true;
      }

      return false;
    },
  },
};

export default resolvers;
