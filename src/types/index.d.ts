import { Redis } from 'ioredis';

export interface Context {
  redis: Redis;
  session: Session;
  url: string;
}

export interface Session extends Express.Session {
  userId?: string;
}

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type Resolver = (parent: any, args: any, context: Context, info: any) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
