import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { createConnection } from 'typeorm';

import schema from './schema';
import { GraphQLError } from 'graphql';

async function main() {
  const server = new ApolloServer({
    schema,
    formatError: (e: GraphQLError) => console.log(e),
  });

  await createConnection();

  const serverInfo = await server.listen();
  console.log(`server listening at ${serverInfo.url}`);
}

main();
