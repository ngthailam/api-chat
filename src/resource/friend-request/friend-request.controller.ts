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
import { CurrentUser } from '../../common/decorator/current-user.decorator.js';
import { ApiTags } from '@nestjs/swagger';
import { RespondFriendRequestDto } from './dto/respond-friend-request.dto.js';
import { FriendRequestDto, mapFriendRequestModelToDto } from './dto/friend-request.dto.js';

@ApiTags('Friend Request')
@Controller('friend-request')
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
  async createFriendRequest(
    @CurrentUser() user: { userId: string },
    @Param('targetUserId') targetUserId: string,
  ): Promise<FriendRequestDto> {
    const model = await this.friendRequestService.createFriendRequest(
      user.userId,
      targetUserId,
    );
    return mapFriendRequestModelToDto(model);
  }

  /**
   * Get all current user's friend requests
   *
   * @param user current user
   */
  @Get('friend-requests')
  async getAllFriendRequests(@CurrentUser() user: { userId: string }): Promise<FriendRequestDto[]> {
    const models = await this.friendRequestService.findAllByFromUser(user.userId);
    return models.map(mapFriendRequestModelToDto);
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
  ): Promise<void> {
    await this.friendRequestService.remove(user.userId, +requestId);
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
  ): Promise<FriendRequestDto> {
    const model = await this.friendRequestService.respondToFriendRequest(
      user.userId,
      +requestId,
      request.response,
    );
    return mapFriendRequestModelToDto(model);
  }
}
