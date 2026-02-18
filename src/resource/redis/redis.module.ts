import { Module, Global } from '@nestjs/common';
import { Redis } from 'ioredis';
import { createRedisOptions } from '../../queue/redis.config.js';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(createRedisOptions());
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
