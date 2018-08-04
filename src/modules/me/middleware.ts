import { Resolver } from '../../types';

export default async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  console.log('here in middleware =======');

  // middleware
  const result = await resolver(parent, args, context, info);
  // afterware

  return result;
};
