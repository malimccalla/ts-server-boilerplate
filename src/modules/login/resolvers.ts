import * as bcrypt from 'bcryptjs';

import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    login: async (
      _: any,
      { email, password }: GQL.ILoginOnMutationArguments
    ): Promise<GQL.ILoginResponse> => {
      const errorResponse: GQL.ILoginResponse = {
        ok: false,
        errors: [{ path: 'login', message: 'Invalid credentials' }],
        user: null,
      };

      const user = await User.findOne({ where: { email } });
      if (!user) return errorResponse;

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return errorResponse;

      if (!user.confirmed) {
        return {
          ok: false,
          errors: [{ message: 'Please confirm your email address', path: 'email' }],
          user: null,
        };
      }

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
