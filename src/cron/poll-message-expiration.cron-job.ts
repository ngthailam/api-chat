import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../resource/message/entities/message.entity.js';
import { Repository } from 'typeorm';
import { MessageType } from '../resource/message/model/message-type.js';

@Injectable()
export class PollMessageExpirationCronJob {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
  ) {}

  @Cron('*/15 * * * *') // every 15 minutes
  async handle() {
    const now = new Date();
    console.log(
      'Running PollMessageExpirationCronJob... Current time:',
      now.toISOString(),
    );

    const nonExpiredMessages = await this.messageRepo
      .createQueryBuilder('message')
      .where('message.type = :type', { type: MessageType.POLL })
      .andWhere(
        `
            COALESCE(
            (message."extraData"->>'isExpired')::boolean,
            false
            ) = :isExpired
        `,
        { isExpired: false },
      )
      .getMany();

    for (const message of nonExpiredMessages) {
      console.log(`Checking poll message ${message.id} for expiration...`);
      const extraData = message.extraData || {};
      const expiresAt = extraData.expiresAt
        ? new Date(extraData.expiresAt)
        : null;

      if (expiresAt && expiresAt <= now) {
        console.log(`Expiring poll message ${message.id}...`);
        await this.messageRepo.update(
          { id: message.id, type: MessageType.POLL },
          {
            extraData: () =>
              `jsonb_set("extraData", '{isExpired}', 'true', true)`,
          },
        );
      } else {
        console.log(
          `Poll message ${message.id} is not expired yet (expires at ${expiresAt})`,
        );
      }
    }
  }
}
