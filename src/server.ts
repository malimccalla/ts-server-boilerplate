import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import * as connectRedis from 'connect-redis';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import { GraphQLError } from 'graphql';
import { Connection } from 'typeorm';

import { confirmEmail } from './routes/confirmEmail';
import schema from './schema';
import { redis } from './services/redis';
import { createTestConn } from './test/createTestConn';
import { Context, Session } from './types';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  if (process.env.NODE_ENV === 'test') {
    await redis.flushall();
  }

  const app = express();
  const RedisStore = connectRedis(session);
  let connection: Connection;
  let port: string;

  const server = new ApolloServer({
    context: ({ req }: { req: express.Request }): Context => ({
      redis,
      session: req.session as Session,
      url: `${req.protocol}://${req.get('host')}`,
    }),
    formatError: (e: GraphQLError) => console.log(e),
    schema,
  });

  const sessionSecret = process.env.SESSION_SECRET as string;

  app.use(cors({ credentials: true, origin: '*' }));

  app.use(
    session({
      store: new RedisStore({}),
      resave: true,
      name: 'qid',
      secret: sessionSecret,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  app.get('/confirm/:id', confirmEmail);

  server.applyMiddleware({ app, path: '/' });

  if (process.env.NODE_ENV === 'test') {
    port = '8080';
    connection = await createTestConn(true);
  } else {
    port = '4000';
    connection = await createTypeormConn();
  }

  await app.listen({ port });

  console.log(`Server listening on port`, port);

  return { connection, port };
};
