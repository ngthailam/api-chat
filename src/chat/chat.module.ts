import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatEntity } from './entities/chat.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { ChatMemberEntity } from './entities/chat-member.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, UserEntity, ChatMemberEntity])],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
