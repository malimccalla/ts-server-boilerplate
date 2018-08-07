import { ResolverMap } from '../../types';
import { createForgotPasswordLink } from '../../util/createForgotPasswordLink';
import lockAccount from '../../util/lockAccount';

const host = process.env.FRONTEND_HOST as string;

const resolvers: ResolverMap = {
  Mutation: {
    forgotPasswordChange: async (
      _,
      { newPassword, key }: GQL.IForgotPasswordChangeOnMutationArguments
    ): Promise<GQL.IForgotPasswordChangeResponse> => {
      console.log(newPassword, key);

      return { ok: true, error: null };
    },
    sendForgotPasswordEmail: async (
      _,
      { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
      { session, redis }
    ): Promise<boolean> => {
      try {
        const { link } = await createForgotPasswordLink(host, session.userId!, redis);

        console.log(`Email: ${email} | Link: ${link}`);

        await lockAccount(session.userId!, redis, session);

        return true;
      } catch (e) {
        console.log(e);

        return false;
      }
    },
  },
};

export default resolvers;
