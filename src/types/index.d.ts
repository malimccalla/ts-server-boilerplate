import { Request } from 'express';
import { Redis } from 'ioredis';

export interface Context {
  redis: Redis;
  url: string;
  req: Request;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
