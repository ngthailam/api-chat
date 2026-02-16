import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entities.js';
import { Repository } from 'typeorm';
import { normalizeUserPair } from '../common/utils/misc.js';

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

    return this.friendRepo.remove(friend);
  }

  create(senderId: string, receiverId: string) {
    const { user1Id, user2Id } = normalizeUserPair(senderId, receiverId);

    const friend = new FriendEntity();
    friend.user1Id = user1Id;
    friend.user2Id = user2Id;

    return this.friendRepo.save(friend);
  }

  findAllUserFriends(userId: string) {
    return this.friendRepo.find({
      where: [
        {
          user1Id: userId,
        },
        {
          user2Id: userId,
        },
      ],
    });
  }
}
