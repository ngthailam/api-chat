import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { Friend } from 'src/friend/entities/friend.entities';
import { normalizeUserPair } from 'src/common/utils/misc';
import { UserWithFriendStatusModel } from './model/user-with-friend-status.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    @InjectRepository(Friend)
    private friendRepo: Repository<Friend>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOneWithFriendStatus(
    currentUserId: string,
    id: string,
  ): Promise<UserWithFriendStatusModel> {
    const user = await this.repo.findOneBy({ id });
    const { user1Id, user2Id } = normalizeUserPair(currentUserId, id);

    const friend = await this.friendRepo.findOne({
      where: {
        user1Id: user1Id,
        user2Id: user2Id,
      },
    });

    return {
      user: user,
      isFriend: friend != null,
    };
  }

  async findByEmailWithFriendStatus(
    currentUserId: string,
    email: string,
  ): Promise<UserWithFriendStatusModel[]> {
    const users = await this.repo.find({
      where: {
        email: ILike(`%${email}%`),
      },
    });

    const friends = await this.friendRepo.find({
      where: [
        {
          user1Id: currentUserId,
        },
        {
          user2Id: currentUserId,
        },
      ],
    });

    const friendSet = new Set(
      friends.map((f) => (f.user1Id == currentUserId ? f.user2Id : f.user1Id)),
    );

    return users.map((user) => ({
      user,
      isFriend: friendSet.has(user.id),
    }));
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
