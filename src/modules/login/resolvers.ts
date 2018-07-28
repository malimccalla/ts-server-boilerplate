import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    login: async (_: any): Promise<any> => {
      return 'ok';
    },
  },
};

export default resolvers;
