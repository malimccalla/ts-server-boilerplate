import { getConnection } from 'typeorm';

export const closeTypeormConn = async () => {
  const connection = getConnection();
  await connection.close();
};
