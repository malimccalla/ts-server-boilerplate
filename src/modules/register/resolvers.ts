import * as yup from 'yup';

import { User } from '../../entity/User';
import { emailValidation, passwordValidation } from '../../services/yupSchemas';
import { ResolverMap } from '../../types';
import { createConfirmEmailLink } from '../../util/createConfirmEmailLink';
import { formatYupError } from '../../util/formatYupError';

const schema = yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
});

const resolvers: ResolverMap = {
  Mutation: {
    register: async (
      _: any,
      { input }: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ): Promise<GQL.IRegisterResponse> => {
      try {
        await schema.validate(input, { abortEarly: false });
      } catch (error) {
        return {
          ok: false,
          user: null,
          errors: formatYupError(error),
        };
      }

      const { email } = input;
      const userAlreadyExists = await User.findOne({
        select: ['id'],
        where: { email },
      });

      if (userAlreadyExists) {
        return {
          ok: false,
          errors: [{ path: 'email', message: 'Email already in use' }],
          user: null,
        };
      }

      const user = await User.create(input);
      await user.save();

      await createConfirmEmailLink(url, user.id, redis);

      return {
        ok: true,
        errors: [],
        user,
      };
    },
  },
};

export default resolvers;
