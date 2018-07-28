import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
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
  let connection: Connection;
  let port: string;

  const server = new ApolloServer({
    context: ({ req }: { req: express.Request }): Context => ({
      redis,
      url: `${req.protocol}://${req.get('host')}`,
    }),
    formatError: (e: GraphQLError) => console.log(e),
    schema,
  });

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
