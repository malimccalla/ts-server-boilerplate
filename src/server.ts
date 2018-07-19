import { ApolloServer } from 'apollo-server';

import schema from './schema';
import { GraphQLError } from 'graphql';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
  });

  const port = process.env.NODE_ENV === 'test' ? 0 : 4000;

  const connection = await createTypeormConn();
  const serverInfo = await server.listen({ http: { port } });

  console.log(`server listening at ${serverInfo.url}`);

  return { serverInfo, connection };
};
