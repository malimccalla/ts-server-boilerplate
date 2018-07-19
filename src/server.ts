import { ApolloServer } from 'apollo-server';
import { GraphQLError } from 'graphql';
import * as Redis from 'ioredis';

import schema from './schema';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const redis = new Redis();

  const server = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
    context: {
      redis,
    },
  });

  const port = process.env.NODE_ENV === 'test' ? 0 : 4000;

  const connection = await createTypeormConn();
  const serverInfo = await server.listen({ http: { port } });

  console.log(`server listening at ${serverInfo.url}`);

  return { serverInfo, connection };
};
