import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';

import schema from './schema';
import { GraphQLError } from 'graphql';
import { createTypeormConn } from './util/createTypeormConn';

async function main() {
  const server = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
  });

  await createTypeormConn();

  const serverInfo = await server.listen();
  console.log(`server listening at ${serverInfo.url}`);
}

main();
