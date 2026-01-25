import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ChatMember } from 'src/chat/entities/chat-member';
import { MessageWebSocketGateway } from './gateway/message-web-socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message, ChatMember])],
  controllers: [MessageController],
  providers: [MessageService, MessageWebSocketGateway],
})
export class MessageModule {}
