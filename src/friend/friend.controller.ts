import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ApiTags } from '@nestjs/swagger';
import { FriendDto, mapFriendModelToDto } from './dto/friend.dto.js';

@ApiTags("Friend")
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  async findAllFriends(@CurrentUser() user: {userId: string}): Promise<FriendDto[]> {
    const friends = await this.friendService.findAllUserFriends(user.userId);
    return friends.map((friend) => mapFriendModelToDto(friend));
  }

  @Delete(':friendId')
  async unfriend(
    @CurrentUser() user: { userId: string },
    @Param('friendId') friendId: string,
  ) {
    this.friendService.unfriend(user.userId, friendId);
  }
}
