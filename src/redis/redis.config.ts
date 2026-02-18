import { RedisOptions } from 'ioredis';
import * as dotenv from 'dotenv';

// MUST be placed at the top of the file
dotenv.config();

export const createRedisOptions = (): RedisOptions => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error('REDIS_URL is not defined');
  }

  const parsed = new URL(redisUrl);

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 6379),
    password: parsed.password || undefined,
    tls: parsed.protocol === 'rediss:' ? {} : undefined,
  };
};
