import { User } from '../../entity/User';
import { ResolverMap } from '../../types';
import * as yup from 'yup';
import { formatYupError } from '../../util/formatYupError';

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(8, 'Password must be longer than 8 characters')
    .max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _: any,
      args: GQL.IRegisterOnMutationArguments
    ): Promise<GQL.IRegisterResponse> => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return {
          ok: false,
          user: null,
          errors: formatYupError(error),
        };
      }

      const { email } = args;
      const userAlreadyExists = await User.findOne({
        select: ['id'],
        where: { email },
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
