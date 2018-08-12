import { Server } from 'http';
import { Redis } from 'ioredis';
import { Connection } from 'typeorm';

import { startServer } from '../server';

let conn: Connection;
let redis: Redis;
let server: Server;

export const setup = async () => {
  const res = await startServer();

  process.env.TEST_HOST = `http://127.0.0.1:${res.port}`;

  conn = res.connection;
  redis = res.redis;
  server = res.server;

  await redis.flushall();
};

export const teardown = async () => {
  Promise.all([conn.close(), redis.quit(), server.close()]);
};
