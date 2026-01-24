import { Logger, Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { ChatMember } from './entities/chat-member';
import { Message } from '../message/entities/message.entity';
import { MessageWebSocketGateway } from './gateway/message-web-socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, ChatMember, Message])],
  controllers: [ChatController],
  providers: [ChatService, MessageWebSocketGateway],
  exports: [ChatService],
})
export class ChatModule {}
