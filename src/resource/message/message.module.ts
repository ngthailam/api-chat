import { Module } from '@nestjs/common';
import { MessageService } from './message.service.js';
import { MessageController } from './message.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity.js';
import { ChatMemberEntity } from '../chat/entities/chat-member.entity.js';
import { MessageWebSocketGateway } from './gateway/message-web-socket.gateway.js';
import { PollMessageExpirationCronJob } from '../../cron/poll-message-expiration.cron-job.js';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ChatMemberEntity])],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageWebSocketGateway,
    PollMessageExpirationCronJob,
  ],
})
export class MessageModule {}
