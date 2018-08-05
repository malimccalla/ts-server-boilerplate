import { Context, Resolver } from '../../types';

export default async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  console.log('CONTEXT', context.session);

  // middleware
  const result = await resolver(parent, args, context, info);
  // afterware

  return result;
};
