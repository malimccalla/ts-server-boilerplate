import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import typeDefs from './schema';
import resolvers from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

async function main() {
  const serverInfo = await server.listen();
  console.log(`server listening at ${serverInfo.url}`);
}

main();
