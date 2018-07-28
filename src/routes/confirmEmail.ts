import { Request, Response } from 'express';
import { User } from '../entity/User';
import { redis } from '../services/redis';

export const confirmEmail = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = await redis.get(id);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    res.status(200).send('ok');
  } else {
    res.send('invalid');
  }
};
