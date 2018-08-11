import * as bcrypt from 'bcryptjs';

import { forgotPasswordPrefix } from '../../constants';
import { User } from '../../entity/User';
import { passwordValidation } from '../../services/yupSchemas';
import { ResolverMap } from '../../types';
import { createForgotPasswordLink } from '../../util/createForgotPasswordLink';
import { formatYupError } from '../../util/formatYupError';
import lockAccount from '../../util/lockAccount';

const host = process.env.FRONTEND_HOST as string;

const resolvers: ResolverMap = {
  Mutation: {
    forgotPasswordChange: async (
      _,
      { input: { key, newPassword } }: GQL.IForgotPasswordChangeOnMutationArguments,
      { redis }
    ): Promise<GQL.IForgotPasswordResponse> => {
      const redisKey = `${forgotPasswordPrefix}${key}`;
      const userId = await redis.get(redisKey);

      if (!userId) {
        return {
          ok: false,
          errors: [{ path: 'key', message: 'Expired key' }],
        };
      }

      try {
        await passwordValidation.validate(newPassword);
      } catch (error) {
        return {
          ok: false,
          errors: formatYupError(error),
        };
      }

      // success
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await Promise.all([
        User.update({ id: userId }, { locked: false, password: hashedPassword }),
        redis.del(redisKey),
      ]);

      return { ok: true, errors: [] };
    },
    sendForgotPasswordEmail: async (
      _,
      { input: { email } }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { session, redis }
    ): Promise<GQL.IForgotPasswordResponse> => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return {
          ok: false,
          errors: [{ path: 'email', message: 'Account does not exist' }],
        };
      }

      const { link } = await createForgotPasswordLink(host, user.id, redis);

      console.log(`Email: ${email} | Link: ${link}`);

      await lockAccount(session.userId!, redis, session);

      return { ok: true, errors: [] };
    },
  },
};

export default resolvers;
