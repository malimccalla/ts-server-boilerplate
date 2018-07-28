import axios from 'axios';

import { User } from '../../entity/User';
import { redis } from '../../services/redis';
import { closeTypeormConn } from '../../test/closeTypeormConn';
import { createConfirmEmailLink } from '../../util/createConfirmEmailLink';
import { createTypeormConn } from '../../util/createTypeormConn';

const host = process.env.TEST_HOST as string;

describe('/confirm/:id', () => {
  let userId: string;
  let confirmation: { id: string; link: string };

  beforeEach(async () => {
    await createTypeormConn();

    const user = await User.create({
      email: 'email@email.com',
      password: 'password123',
    }).save();

    userId = user.id;

    confirmation = await createConfirmEmailLink(host, userId, redis);
  });

  afterEach(async () => {
    await closeTypeormConn();
  });

  test('should respond with "ok" and confirm user on sending link request', async () => {
    // 1st request
    const res = await axios.get(confirmation.link);

    const user = await User.findOne({ where: { id: userId } });

    expect(res.data).toEqual('ok');
    expect(user!.confirmed).toBe(true);
  });

  test('should respond with "invalid" on sending link request twice', async () => {
    // 1st request
    await axios.get(confirmation.link);
    // 2nd request
    const res = await axios.get(confirmation.link);

    const value = await redis.get(confirmation.id);

    expect(res.data).toEqual('invalid');
    expect(value).toBeNull();
  });
});
