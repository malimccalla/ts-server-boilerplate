import { User } from './entity/User';
import { ResolverMap } from './types';

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }) => `Helo ${name || 'world'}`,
  },
  Mutation: {
    register: async (_, { email, password }) => {
      await User.create({ email, password });
    },
  },
};

export default resolvers;
