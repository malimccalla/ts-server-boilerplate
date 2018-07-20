import { ApolloServer } from 'apollo-server-express';
import { GraphQLError } from 'graphql';
import * as Redis from 'ioredis';

import * as express from 'express';

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

  apolloServer.applyMiddleware({ app });

  const port = process.env.NODE_ENV === 'test' ? 0 : 4000;
  const connection = await createTypeormConn();
  // const serverInfo = await server.console.log(`server listening at ${serverInfo.url}`);
  const server = await app.listen({ port });
  console.log(`Server listening on port`, port);
  return { connection, server };
};
