import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Query: {
    me: async (_, __, { session }) => {
      return User.findOne({ where: { id: session.userId } });
    },
  },
};

export default resolvers;
