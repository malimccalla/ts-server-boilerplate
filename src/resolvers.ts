export default {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || 'world'}`,
  },
};
