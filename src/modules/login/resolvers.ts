import * as bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _: any,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
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

      session.userId = user.id;

      // exist in database and have given correct credentials
      return {
        ok: true,
        errors: [],
        user,
      };
    },
  },
};

export default resolvers;
