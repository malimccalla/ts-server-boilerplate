import * as RateLimit from 'express-rate-limit';
import * as RateLimitStore from 'rate-limit-redis';

import { redis } from './redis';

export const limiter = new RateLimit({
  store: new RateLimitStore({
    client: redis,
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});
