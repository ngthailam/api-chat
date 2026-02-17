import { Module } from '@nestjs/common';
import { FriendService } from './friend.service.js';
import { FriendController } from './friend.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([FriendEntity])],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
