import { createConnection, getConnectionOptions } from 'typeorm';

export const createTestConn = async (truncate: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  return createConnection({
    ...connectionOptions,
    name: 'default',
    synchronize: truncate,
    dropSchema: truncate,
  });
};
