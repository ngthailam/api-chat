import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service.js';
import { FriendRequestController } from './friend-request.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.js';
import { FriendModule } from '../friend/friend.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequest]), FriendModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
