import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request';
import { Repository } from 'typeorm';
import { FriendService } from 'src/friend/friend.service';
import { CustomException } from 'src/common/errors/exception/custom.exception';
import { CustomErrors } from 'src/common/errors/error_codes';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepo: Repository<FriendRequest>,
    private readonly friendService: FriendService,
  ) {}

  async createFriendRequest(userId: string, targetUserId: string) {
    const existingFriendRequest = await this.friendRequestRepo.find({
      where: [
        {
          senderId: userId,
          receiverId: targetUserId,
        },
        {
          senderId: targetUserId,
          receiverId: userId,
        },
      ],
    });

    if (existingFriendRequest.length) {
      throw new CustomException(CustomErrors.FR_ALREADY_EXIST);
    }

    const friendRequestEntity = new FriendRequest();
    friendRequestEntity.senderId = userId;
    friendRequestEntity.receiverId = targetUserId;
    friendRequestEntity.createdAt = new Date();

    return this.friendRequestRepo.save(friendRequestEntity);
  }

  findAllRelatingUser(userId: string) {
    return this.friendRequestRepo.find({
      where: [{ receiverId: userId }, { senderId: userId }],
    });
  }

  async remove(userId: string, requestId: number) {
    const request = await this.friendRequestRepo.findOneBy({ id: requestId });

    if (!request) {
      throw new CustomException(CustomErrors.FR_NOT_EXIST);
    }

    if (request.senderId != userId) {
      throw new CustomException(CustomErrors.FR_NOT_OWNER);
    }

    return this.friendRequestRepo.delete({ id: requestId });
  }

  async respondToFriendRequest(
    userId: string,
    requestId: number,
    response: 'accept' | 'reject',
  ) {
    const request = await this.friendRequestRepo.findOneBy({ id: requestId });

    if (!request) {
      throw new CustomException(CustomErrors.FR_NOT_EXIST);
    }

    if (request.receiverId != userId) {
      throw new CustomException(CustomErrors.FR_NOT_OWNER);
    }

    request.status = response;
    request.respondAt = new Date();
    const savedRequest = await this.friendRequestRepo.save(request);

    // Create a friend relationship
    this.friendService.create(request.senderId, request.receiverId);

    return savedRequest;
  }
}
