import { Queue } from 'bullmq';
import { redisConnection } from '../redis.config.js';

export const pollMessageExpireQueue = new Queue('poll-expiration', {
  connection: redisConnection,
});
