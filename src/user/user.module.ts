import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { Chat } from '../chat/entities/chat.entity.js';
import { Friend } from '../friend/entities/friend.entities.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Friend])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
