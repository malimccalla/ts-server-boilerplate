import { ApolloServer } from 'apollo-server';

import schema from './schema';
import { GraphQLError } from 'graphql';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const server = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
  });

  const port = process.env.PORT === 'test' ? 0 : 4000;

  await createTypeormConn();
  const serverInfo = await server.listen({ http: { port } });

  console.log(`server listening at ${serverInfo.url}`);

  return serverInfo;
};
