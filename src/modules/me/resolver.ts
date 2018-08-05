import { User } from '../../entity/User';
import { ResolverMap } from '../../types';
import { createMiddleware } from '../../util/createMiddleware';
import middleware from './middleware';

export const resolver: ResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_, __, { session }) => {
      console.log('IN RESOLVER', session);

      return User.findOne({ where: { id: session.userId } });
    }),
  },
};
