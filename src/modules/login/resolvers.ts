import * as bcrypt from 'bcryptjs';

import { userSessionIdPrefix } from '../../constants';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _: any,
      { input: { email, password } }: GQL.ILoginOnMutationArguments,
      { session, redis, req }
    ): Promise<GQL.ILoginResponse> => {
      const errorResponse = (path: string, message: string): GQL.ILoginResponse => ({
        ok: false,
        errors: [{ path, message }],
        user: null,
      });

      const user = await User.findOne({ where: { email } });
      if (!user) return errorResponse('email', 'Invalid credentials');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return errorResponse('password', 'Invalid credentials');

      if (!user.confirmed) {
        return errorResponse('email', 'Please confirm your email address');
      }

      if (user.locked) {
        return errorResponse('account', 'Account is locked');
      }

      // login successful
      session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return {
        ok: false,
        errors: [],
        user,
      };
    },
  },
};

export default resolvers;
