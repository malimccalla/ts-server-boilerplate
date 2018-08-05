import { GraphQLMiddlewareFunc, Resolver } from '../types';

export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => {
  console.log('CREATE MIDDLEWARE');

  return (parent: any, args: any, context: any, info: any) =>
    middlewareFunc(resolverFunc, parent, args, context, info);
};
