import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { User } from '../user/entities/user.entity';
import { ChatMember } from './entities/chat-member';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, ChatMember])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
