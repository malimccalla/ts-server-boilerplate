import { User } from '../../entity/User';
import { ResolverMap } from '../../types';

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _: any,
      args: GQL.IRegisterOnMutationArguments
    ): Promise<GQL.IRegisterResponse> => {
      const userAlreadyExists = await User.findOne({
        select: ['id'],
        where: { email: args.email },
      });

      if (userAlreadyExists) {
        return {
          ok: false,
          errors: [{ path: 'Email', message: 'Email already in use' }],
          user: null,
        };
      }

      const user = await User.create(args);
      await user.save();

      return {
        ok: true,
        user,
        errors: [],
      };
    },
  },
};

export default resolvers;
