import { Module } from '@nestjs/common';
import { MessageService } from './message.service.js';
import { MessageController } from './message.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity.js';
import { ChatMember } from '../chat/entities/chat-member.js';
import { MessageWebSocketGateway } from './gateway/message-web-socket.gateway.js';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ChatMember])],
  controllers: [MessageController],
  providers: [MessageService, MessageWebSocketGateway],
})
export class MessageModule {}
