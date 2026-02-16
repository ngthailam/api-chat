import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FriendService } from './friend.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Friend")
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  findAllFriends(@CurrentUser() user: {userId: string}) {
    return this.friendService.findAllUserFriends(user.userId);
  }

  @Delete(':friendId')
  unfriend(
    @CurrentUser() user: { userId: string },
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.unfriend(user.userId, friendId);
  }
}
