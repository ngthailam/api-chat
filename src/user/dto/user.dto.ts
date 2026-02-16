import { User } from '../entities/user.entity.js';
import { UserWithFriendStatusModel } from '../model/user-with-friend-status.model.js';

export class UserDto {
  id: string;

  email: string;

  isFriend?: boolean;

  static fromEntity(user: User, isFriend: boolean = null): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.email = user.email;
    userDto.isFriend = isFriend;

    return userDto;
  }

  static fromUserWithFriendStatusModel(
    model: UserWithFriendStatusModel,
  ): UserDto {
    const userDto = new UserDto();

    userDto.id = model.user.id;
    userDto.email = model.user.email;
    userDto.isFriend = model.isFriend;

    return userDto;
  }
}
