import { User } from './entity/User';
import { ResolverMap } from './types';

const resolvers: ResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) => `Helo ${name || 'world'}`,
  },
  Mutation: {
    register: async (
      _: any,
      args: GQL.IRegisterOnMutationArguments
    ): Promise<boolean> => {
      await User.create(args).save();
      return true;
    },
  },
};

export default resolvers;
