import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@ApiTags('2 - User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const userEntites = await this.userService.findAll();
    return userEntites.map((user) => UserDto.fromEntity(user));
  }

  @Get('by-email/:email')
  async findByEmail(
    @CurrentUser() user: { userId: string },
    @Param('email') email: string,
  ) {
    return (
      await this.userService.findByEmailWithFriendStatus(user.userId, email)
    ).map((e) => UserDto.fromUserWithFriendStatusModel(e));
  }

  @Get(':id')
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ) {
    const model = await this.userService.findOneWithFriendStatus(
      user.userId,
      id,
    );
    return UserDto.fromUserWithFriendStatusModel(model);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
