import { User } from '../entities/user.entity';

export class UserDto {
  id: string;

  email: string;

  static fromEntity(user: User): UserDto {
    const userDto = new UserDto();

    userDto.id = user.id;
    userDto.email = user.email;

    return userDto;
  }
}
