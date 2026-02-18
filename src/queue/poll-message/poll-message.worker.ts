import { Worker } from 'bullmq';
import { createRedisOptions } from '../redis.config.js';
import { AppDataSource } from '../../common/database/typeorm.config.js';
import { MessageEntity } from '../../resource/message/entities/message.entity.js';
import { MessageType } from '../../resource/message/model/message-type.js';
import { MessageEntityPollExtraData } from '../../resource/message/entities/message-poll-extra-data.entity.js';

new Worker(
  'poll-expiration',
  async (job) => {
    const { messageId } = job.data;

    const repo = AppDataSource.getRepository(MessageEntity);

    const message = await repo.findOne({ where: { id: messageId } });

    if (!message) return;
    if (message.type !== MessageType.POLL) return;

    const pollMessage = message.extraData as MessageEntityPollExtraData;

    if (!pollMessage || pollMessage.isExpired) return;

    console.log(`Marking poll message ${messageId} as expired`);
    await repo.update(
      { id: messageId, type: MessageType.POLL },
      {
        extraData: () => `jsonb_set("extraData", '{isExpired}', 'true', true)`,
      },
    );
  },
  {
    connection: createRedisOptions(),
  },
);
