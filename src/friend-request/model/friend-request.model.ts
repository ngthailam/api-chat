import { FriendRequestEntity } from '../entities/friend-request.entity.js';

export class FriendRequest {
  id: number;

  senderId: string;

  receiverId: string;

  status: 'pending' | 'accept' | 'reject';

  respondAt?: Date;

  createdAt: Date;
}

export function mapFriendRequestEntityToModel(
  entity: FriendRequestEntity,
): FriendRequest {
  return {
    id: entity.id,
    senderId: entity.senderId,
    receiverId: entity.receiverId,
    status: entity.status,
    respondAt: entity.respondAt,
    createdAt: entity.createdAt,
  };
}

