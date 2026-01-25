import {
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

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
  async findByEmail(@Param('email') email: string) {
    const userEntity = await this.userService.findByEmail(email);
    return UserDto.fromEntity(userEntity);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userEntity = await this.userService.findOne(id);
    return UserDto.fromEntity(userEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
