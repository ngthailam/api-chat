import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}
  testRedis(): string | PromiseLike<string> {
    this.redis.set('testKey', 'Hello Redis!');
    return this.redis.get('testKey');
  }

  getHello(): string {
    return 'Hello World!';
  }
}
