import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { ChatEntity } from '../chat/entities/chat.entity.js';
import { FriendEntity } from '../friend/entities/friend.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ChatEntity, FriendEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
