import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entity.js';
import { Repository } from 'typeorm';
import { normalizeUserPair } from '../common/utils/misc.js';
import { Friend, mapFriendEntityToModel } from './model/friend.model.js';
import { CustomException } from '../common/errors/exception/custom.exception.js';
import { CustomErrors } from '../common/errors/error_codes.js';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity)
    private readonly friendRepo: Repository<FriendEntity>,
  ) {}

  async unfriend(userId: string, friendId: string) {
    const { user1Id, user2Id } = normalizeUserPair(userId, friendId);
    const friend = await this.friendRepo.findOne({
      where: {
        user1Id: user1Id,
        user2Id: user2Id,
      },
    });

    if (!friend) {
      throw new CustomException(CustomErrors.FRIEND_NOT_EXIST);
    }

    await this.friendRepo.remove(friend);
  }

  async create(senderId: string, receiverId: string): Promise<Friend> {
    const { user1Id, user2Id } = normalizeUserPair(senderId, receiverId);

    const friend = new FriendEntity();
    friend.user1Id = user1Id;
    friend.user2Id = user2Id;

    const savedFriend = await this.friendRepo.save(friend);
    return mapFriendEntityToModel(savedFriend);
  }

  async findAllUserFriends(userId: string): Promise<Friend[]> {
    const friends = await this.friendRepo.find({
      where: [
        {
          user1Id: userId,
        },
        {
          user2Id: userId,
        },
      ],
    });

    return friends.map((friend) => mapFriendEntityToModel(friend));
  }
}
