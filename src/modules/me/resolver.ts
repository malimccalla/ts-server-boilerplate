import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

export const resolver: ResolverMap = {
  Query: {
    me: (_, __, { session }) => {
      console.log('WTF');

      User.findOne({ where: { id: session.userId } });
    },
  },
};
