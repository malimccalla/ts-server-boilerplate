import { Redis } from '../../node_modules/@types/ioredis';
import { User } from '../entity/User';
import { Session } from '../types';
import { deleteAllSessionsByUserId } from './deleteAllSessionsByUserId';

const lockAccount = async (userId: string, redis: Redis, session: Session) => {
  await User.update({ id: userId }, { locked: true });
  await deleteAllSessionsByUserId(userId, redis, session);
};

export default lockAccount;
