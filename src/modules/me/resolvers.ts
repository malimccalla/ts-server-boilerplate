import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Query: {
    me: async (_, __, { session }) => {
      console.log('IN RESOLVER', session);

      const user = await User.findOne({ where: { id: session.userId } });

      return user;
    },
  },
};

export default resolvers;
