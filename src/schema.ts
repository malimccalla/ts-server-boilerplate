import { makeExecutableSchema } from 'apollo-server';
import * as fs from 'fs';
import * as glob from 'glob';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import * as path from 'path';

const pathToModules = path.join(__dirname, './modules');

const typeDefs = glob
  .sync(`${pathToModules}/**/*.graphql`)
  .map(x => fs.readFileSync(x, { encoding: 'utf8' }));

const resolvers = glob
  .sync(`${pathToModules}/**/resolvers.?s`)
  .map(resolver => require(resolver).default);

const schema = {
  typeDefs: mergeTypes(typeDefs),
  resolvers: mergeResolvers(resolvers),
};

export default makeExecutableSchema(schema);
