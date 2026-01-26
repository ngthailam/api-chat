import { User } from '../entities/user.entity';

export type UserWithFriendStatusModel = {
  user: User;
  isFriend: boolean;
};
