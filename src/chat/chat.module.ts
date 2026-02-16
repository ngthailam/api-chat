import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity.js';
import { User } from '../user/entities/user.entity.js';
import { ChatMember } from './entities/chat-member.js';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, ChatMember])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
