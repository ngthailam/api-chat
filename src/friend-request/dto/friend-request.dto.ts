import {
  FriendRequest,
  mapFriendRequestEntityToModel,
} from '../model/friend-request.model.js';
import { FriendRequestEntity } from '../entities/friend-request.entity.js';

export class FriendRequestDto {
  id: number;

  senderId: string;

  receiverId: string;

  status: 'pending' | 'accept' | 'reject';

  respondAt?: Date;

  createdAt: Date;
}

export function mapFriendRequestModelToDto(
  model: FriendRequest,
): FriendRequestDto {
  const dto = new FriendRequestDto();
  dto.id = model.id;
  dto.senderId = model.senderId;
  dto.receiverId = model.receiverId;
  dto.status = model.status;
  dto.respondAt = model.respondAt;
  dto.createdAt = model.createdAt;
  return dto;
}

export function mapFriendRequestEntityToDto(
  entity: FriendRequestEntity,
): FriendRequestDto {
  return mapFriendRequestModelToDto(mapFriendRequestEntityToModel(entity));
}

