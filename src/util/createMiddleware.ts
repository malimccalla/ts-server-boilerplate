import { GraphQLMiddlewareFunc, Resolver } from '../types';

export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => (parent: any, args: any, context: any, info: any) => {
  console.log('CREATE MIDDLEWARE');

  return middlewareFunc(resolverFunc, parent, args, context, info);
};
