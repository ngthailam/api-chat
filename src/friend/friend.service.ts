import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entities';
import { Repository } from 'typeorm';
import { normalizeUserPair } from 'src/common/utils/misc';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
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

    const friend = new Friend();
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
