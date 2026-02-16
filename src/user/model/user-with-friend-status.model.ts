import { User } from '../entities/user.entity.js';

export type UserWithFriendStatusModel = {
  user: User;
  isFriend: boolean;
};
