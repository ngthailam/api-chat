import { Module } from '@nestjs/common';
import { FriendService } from './friend.service.js';
import { FriendController } from './friend.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entities.js';

@Module({
  imports: [TypeOrmModule.forFeature([Friend])],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService],
})
export class FriendModule {}
