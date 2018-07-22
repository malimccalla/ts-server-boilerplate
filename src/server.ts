import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { GraphQLError } from 'graphql';
import * as Redis from 'ioredis';

import { User } from './entity/User';
import schema from './schema';
import { Context } from './types';
import { createTypeormConn } from './util/createTypeormConn';

export const startServer = async () => {
  const app = express();
  const redis: Redis.Redis = new Redis();

  const server = new ApolloServer({
    context: ({ req }: { req: express.Request }): Context => ({
      redis,
      url: `${req.protocol}://${req.get('host')}`,
    }),
    formatError: (e: GraphQLError) => console.log(e),
    schema,
  });

  app.get('/confirm/:id', async (req, res) => {
    const { id } = req.params as { id: string };
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.status(200).send('ok');
    } else {
      res.send('invalid');
    }
  });

  server.applyMiddleware({ app, path: '/' });

  const port = process.env.NODE_ENV === 'test' ? 8080 : 4000;
  const connection = await createTypeormConn();

  await app.listen({ port });

  console.log(`Server listening on port`, port);

  return { connection, port };
};
