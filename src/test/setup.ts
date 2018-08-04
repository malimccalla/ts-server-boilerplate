import { startServer } from '../server';

require('dotenv').config();

export const setup = async () => {
  const { port } = await startServer();

  process.env.TEST_HOST = `http://127.0.0.1:${port}`;
};
