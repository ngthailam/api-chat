import { UserEntity } from '../entities/user.entity.js';

export class UserWithFriendStatus {
  user: UserEntity;
  isFriend: boolean;
};
