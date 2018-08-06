import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    forgotPasswordChange: async (_, __): Promise<GQL.IForgotPasswordChangeResponse> => {
      return { ok: true, error: null };
    },
  },
};

export default resolvers;
