import { Queue } from 'bullmq';
import { createRedisOptions } from '../redis.config.js';

export const pollMessageExpireQueue = new Queue('poll-expiration', {
  connection: createRedisOptions(),
});
