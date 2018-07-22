import { Redis } from 'ioredis';

export interface Context {
  redis: Redis;
  url: string;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
