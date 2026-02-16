import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { UpdateUserTokenDto } from './dto/update-user-token.dto.js';
import { RegisterUserTokenDto } from './dto/register-user-token.dto.js';
import { DeviceId } from '../common/decorator/device-id.decorator.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly userTokenService: NotificationService) {}

  @Get('all')
  findAll() {
    return this.userTokenService.findAll();
  }

  @Post('token/test-message')
  testSend(
    @CurrentUser() user: { userId: string },
    @DeviceId() deviceId: string,
    @Body() request: { body: string; title: string },
  ) {
    return this.userTokenService.sendNotification(user.userId, deviceId, {
      title: request.title,
      body: request.body,
    });
  }

  @Post('token')
  registerToken(
    @CurrentUser() user: { userId: string },
    @DeviceId() deviceId: string,
    @Body() request: RegisterUserTokenDto,
  ) {
    return this.userTokenService.registerToken(user.userId, deviceId, request);
  }

  @Delete('token')
  unregisterToken(
    @CurrentUser() user: { userId: string },
    @DeviceId() deviceId: string,
  ) {
    return this.userTokenService.unregisterToken(user.userId, deviceId);
  }

  @Patch('token')
  updateUserToken(
    @CurrentUser() user: { userId: string },
    @DeviceId() deviceId: string,
    @Body() request: UpdateUserTokenDto,
  ) {
    return this.userTokenService.updateUserToken(
      user.userId,
      deviceId,
      request,
    );
  }
}
