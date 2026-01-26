import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Friend } from 'src/friend/entities/friend.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Chat, Friend])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
