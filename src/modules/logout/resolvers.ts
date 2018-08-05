import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session }) =>
      new Promise(resolve =>
        session.destroy(err => {
          if (err) {
            console.log('logout error: ', err);
          }

          resolve(true);
        })
      ),
  },
};

export default resolvers;
