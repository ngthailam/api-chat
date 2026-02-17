import { FriendEntity } from '../entities/friend.entity.js';

export class Friend {
  id: number;

  user1Id: string;

  user2Id: string;

  createdAt: Date;
}

export function mapFriendEntityToModel(friendEntity: FriendEntity): Friend {
  return {
    id: friendEntity.id,
    user1Id: friendEntity.user1Id,
    user2Id: friendEntity.user2Id,
    createdAt: friendEntity.createdAt,
  };
}

