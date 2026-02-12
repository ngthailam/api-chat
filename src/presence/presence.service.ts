import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { UserIdDeviceIdModel } from './model/userid-deviceid.model';

@Injectable()
export class PresenceService {
  private readonly TTL = 60 * 5; // seconds

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   *
   * Build a unique key for a user's device presence
   * to allow supporting multiple devices per user.
   *
   * @param userId user id
   * @param deviceId device id
   */
  buildKey(userId: string, deviceId: string) {
    return `user:presence:${userId}:device:${deviceId}`;
  }

  async markOnline(model: UserIdDeviceIdModel) {
    console.log("Marking online:", model);

    if (await this.isOnline(model)) {
      console.log("Already online, refreshing TTL:", model);
      this.refresh(model);
      return;
    }

    console.log("Setting online status in Redis:", model);
    await this.redis.set(
      this.buildKey(model.userId, model.deviceId),
      1,
      'EX',
      this.TTL,
    );
  }

  async refresh(model: UserIdDeviceIdModel) {
    await this.redis.expire(
      this.buildKey(model.userId, model.deviceId),
      this.TTL,
    );
  }

  async markOffline(model: UserIdDeviceIdModel): Promise<boolean> {
    const deleted = await this.redis.del(
      this.buildKey(model.userId, model.deviceId),
    );
    return deleted > 0;
  }

  async isOnline(model: UserIdDeviceIdModel): Promise<boolean> {
    const exists = await this.redis.exists(
      this.buildKey(model.userId, model.deviceId),
    );
    return exists === 1;
  }

  /**
   *
   * @param userIdDeviceIdPair: Array of objects containing userId and deviceId
   *
   * @returns A record mapping input array index to their online status (true if online, false if offline)
   */
  async getOnlineStatuses(
    userIdDeviceIdPair: UserIdDeviceIdModel[],
  ): Promise<Record<number, boolean>> {
    console.log("PresenceService getOnlineStatuses called with:", userIdDeviceIdPair);

    if (!userIdDeviceIdPair.length) {
      return {};
    }

    const keys = userIdDeviceIdPair.map(({ userId, deviceId }) =>
      this.buildKey(userId, deviceId),
    );

    return new Promise((resolve, reject) => {
      this.redis.mget(...keys, (err, results) => {
        if (err) {
          return reject(err);
        }

        const statusMap: Record<number, boolean> = {};
        results.forEach((result, index) => {
          statusMap[index] = result !== null;
        });

        resolve(statusMap);
      });
    });
  }
}
