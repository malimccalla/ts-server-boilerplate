import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import * as connectRedis from 'connect-redis';
import * as express from 'express';
import * as session from 'express-session';
import { GraphQLError } from 'graphql';
import { Connection } from 'typeorm';

import { confirmEmail } from './routes/confirmEmail';
import schema from './schema';
import { redis } from './services/redis';
import { createTestConn } from './test/createTestConn';
import { Context } from './types';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  let connection: Connection;
  let port: string;

  const server = new ApolloServer({
    context: ({ req }: { req: express.Request }): Context => ({
      redis,
      req,
      url: `${req.protocol}://${req.get('host')}`,
    }),
    formatError: (e: GraphQLError) => console.log(e),
    schema,
  });

  app.get('/confirm/:id', confirmEmail);

  app.use(
    session({
      store: new RedisStore({}),
      resave: true,
      name: 'qid',
      secret: 'secret',
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

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
