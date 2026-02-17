import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequestEntity } from './entities/friend-request.entity.js';
import { Repository } from 'typeorm';
import { FriendService } from '../friend/friend.service.js';
import { CustomException } from '../../common/errors/exception/custom.exception.js';
import { CustomErrors } from '../../common/errors/error_codes.js';
import { FriendRequest, mapFriendRequestEntityToModel } from './model/friend-request.model.js';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepo: Repository<FriendRequestEntity>,
    private readonly friendService: FriendService,
  ) {}

  async createFriendRequest(userId: string, targetUserId: string): Promise<FriendRequest> {
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

    const friendRequestEntity = new FriendRequestEntity();
    friendRequestEntity.senderId = userId;
    friendRequestEntity.receiverId = targetUserId;
    friendRequestEntity.createdAt = new Date();

    const savedEntity = await this.friendRequestRepo.save(friendRequestEntity);
    return mapFriendRequestEntityToModel(savedEntity);
  }

  async findAllByFromUser(userId: string): Promise<FriendRequest[]> {
    const entities = await this.friendRequestRepo.find({
      where: [{ receiverId: userId }, { senderId: userId }],
    });
    return entities.map(mapFriendRequestEntityToModel);
  }

  async remove(userId: string, requestId: number): Promise<void> {
    const request = await this.friendRequestRepo.findOneBy({ id: requestId });

    if (!request) {
      throw new CustomException(CustomErrors.FR_NOT_EXIST);
    }

    if (request.senderId != userId) {
      throw new CustomException(CustomErrors.FR_NOT_OWNER);
    }

    await this.friendRequestRepo.delete({ id: requestId });
  }

  async respondToFriendRequest(
    userId: string,
    requestId: number,
    response: 'accept' | 'reject',
  ): Promise<FriendRequest> {
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
    await this.friendService.create(request.senderId, request.receiverId);

    return mapFriendRequestEntityToModel(savedRequest);
  }
}
