import { Friend, mapFriendEntityToModel } from '../model/friend.model.js';
import { FriendEntity } from '../entities/friend.entity.js';

export class FriendDto {
  id: number;

  user1Id: string;

  user2Id: string;

  createdAt: Date;
}

export function mapFriendModelToDto(friend: Friend): FriendDto {
  const friendDto = new FriendDto();
  friendDto.id = friend.id;
  friendDto.user1Id = friend.user1Id;
  friendDto.user2Id = friend.user2Id;
  friendDto.createdAt = friend.createdAt;
  return friendDto;
}

export function mapFriendEntityToDto(friendEntity: FriendEntity): FriendDto {
  return mapFriendModelToDto(mapFriendEntityToModel(friendEntity));
}

