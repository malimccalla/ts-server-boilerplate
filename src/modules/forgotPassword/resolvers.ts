import { forgotPasswordPrefix } from '../../constants';
import { User } from '../../entity/User';
import { ResolverMap } from '../../types';
import { createForgotPasswordLink } from '../../util/createForgotPasswordLink';
import lockAccount from '../../util/lockAccount';

const host = process.env.FRONTEND_HOST as string;

const resolvers: ResolverMap = {
  Mutation: {
    forgotPasswordChange: async (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis }
    ): Promise<GQL.IForgotPasswordResponse> => {
      const userId = redis.get(`${forgotPasswordPrefix}${key}`);

      if (!userId) {
        return {
          ok: false,
          error: { path: 'key', message: 'Expired key' },
        };
      }

      console.log(newPassword);

      return { ok: true, error: null };
    },
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { session, redis }
    ): Promise<GQL.IForgotPasswordResponse> => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return {
          ok: false,
          error: { path: 'email', message: 'Account does not exist' },
        };
      }

      const { link } = await createForgotPasswordLink(host, user.id, redis);

      console.log(`Email: ${email} | Link: ${link}`);

      await lockAccount(session.userId!, redis, session);

      return { ok: true, error: null };
    },
  },
};

export default resolvers;
