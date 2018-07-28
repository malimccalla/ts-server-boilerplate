import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { GraphQLError } from 'graphql';

import { confirmEmail } from './routes/confirmEmail';
import schema from './schema';
import { redis } from './services/redis';
import { Context } from './types';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const app = express();

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

  const port = process.env.NODE_ENV === 'test' ? 8080 : 4000;
  const connection = await createTypeormConn();

  await app.listen({ port });

  console.log(`Server listening on port`, port);

  return { connection, port };
};
