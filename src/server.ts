import 'dotenv/config';
import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import * as connectRedis from 'connect-redis';
import * as cors from 'cors';
import * as express from 'express';
import * as session from 'express-session';
import { GraphQLError } from 'graphql';
import { Connection } from 'typeorm';

import { redisSessionPrefix } from './constants';
import { confirmEmail } from './routes/confirmEmail';
import schema from './schema';
import { limiter } from './services/rateLimit';
import { redis } from './services/redis';
import { createTestConn } from './test/createTestConn';
import { Context, Session } from './types';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  let connection: Connection;
  let port: string;

  const apolloServer = new ApolloServer({
    context: ({ req }: { req: express.Request }): Context => ({
      redis,
      session: req.session as Session,
      url: `${req.protocol}://${req.get('host')}`,
      req,
    }),
    formatError: (e: GraphQLError) => console.log(e),
    schema,
  });

  const sessionSecret = process.env.SESSION_SECRET as string;

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
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

  if (process.env.NODE_ENV === 'production') {
    app.use(limiter);
  }

  const corsOptions = { credentials: true, origin: 'http://localhost:3000' };

  app.use(cors(corsOptions));

  app.get('/confirm/:id', confirmEmail);

  apolloServer.applyMiddleware({ app, path: '/', cors: corsOptions });

  if (process.env.NODE_ENV === 'test') {
    port = '8080';
    connection = await createTestConn(true);
  } else {
    port = process.env.PORT || '4000';
    connection = await createTypeormConn();
  }

  const server = await app.listen({ port });

  return { connection, port, redis, server };
};
