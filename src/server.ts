import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { GraphQLError } from 'graphql';
import * as Redis from 'ioredis';

import schema from './schema';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const app = express();
  const redis: Redis.Redis = new Redis();

  const apolloServer = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
    context: {
      redis,
    },
  });

  apolloServer.applyMiddleware({ app, path: '/' });

  app.get('/confirm', (_, res) => {
    res.json({
      confirm: true,
    });
  });

  const port = process.env.NODE_ENV === 'test' ? 8080 : 4000;
  const connection = await createTypeormConn();

  await app.listen({ port });

  console.log(`Server listening on port`, port);
  return { connection, port };
};
