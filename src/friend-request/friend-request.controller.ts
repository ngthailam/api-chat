import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto.js';

@Controller('friend-request')
@ApiTags('Friend Request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  /**
   * POST /users/:targetUserId/friend-requests
   * Send a friend request to another user
   *
   * @param user current user
   * @param targetUserId the user to send request to
   *
   * Consulted chat-gpt, this makes friendRequest itself
   * a resource -> create CRUD based on that resource
   * other APIs on friend requests will be based on that
   */
  @Post('users/:targetUserId/friend-requests')
  createFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('targetUserId') targetUserId: string,
  ) {
    return this.friendRequestService.createFriendRequest(
      user.userId,
      targetUserId,
    );
  }

  /**
   * Get all current user's friend requests
   *
   * @param user current user
   */
  @Get('friend-requests')
  async getAllFriendRequests(@CurrentUser() user: { userId: string }) {
    return this.friendRequestService.findAllRelatingUser(user.userId);
  }

  /**
   * Revoke a friend request
   *
   * @param user current user
   * @param requestId id of the request
   */
  @Delete('friend-requests/:requestId')
  async revokeFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('requestId') requestId: string,
  ) {
    return this.friendRequestService.remove(user.userId, +requestId);
  }

  /**
   * Respond accept or reject a friend request
   *
   * @param user current user
   * @param requestId id of the request
   */
  @Patch('friend-requests/:requestId')
  async respondToFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('requestId') requestId: string,
    @Body() request: RespondFriendRequestDto,
  ) {
    return this.friendRequestService.respondToFriendRequest(
      user.userId,
      +requestId,
      request.response,
    );
  }
}
