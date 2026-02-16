import { UserEntity } from '../entities/user.entity.js';
import { UserWithFriendStatus } from '../model/user-with-friend-status.model.js';

export class UserDto {
  id: string;

  email: string;

  isFriend?: boolean;

  static fromEntity(user: UserEntity, isFriend: boolean = null): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.email = user.email;
    userDto.isFriend = isFriend;

    return userDto;
  }

  static fromUserWithFriendStatusModel(
    model: UserWithFriendStatus,
  ): UserDto {
    const userDto = new UserDto();

    userDto.id = model.user.id;
    userDto.email = model.user.email;
    userDto.isFriend = model.isFriend;

    return userDto;
  }
}
