import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request';
import { Repository } from 'typeorm';
import { FriendService } from 'src/friend/friend.service';

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
      throw new HttpException(
        'Friend request already exist',
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        'Friend request does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (request.senderId != userId) {
      throw new HttpException(
        'This request is not sent by you, so you cannot cancel it',
        HttpStatus.BAD_REQUEST,
      );
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
      throw new HttpException(
        'Friend request does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    if (request.receiverId != userId) {
      throw new HttpException(
        'This request is not sent to you, so you cannot accept or reject it',
        HttpStatus.BAD_REQUEST,
      );
    }

    request.status = response;
    request.respondAt = new Date();
    const savedRequest = await this.friendRequestRepo.save(request);

    // Create a friend relationship
    this.friendService.create(request.senderId, request.receiverId);

    return savedRequest;
  }
}
