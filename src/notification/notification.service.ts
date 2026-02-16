import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserToken } from './entity/user-token.entity.js';
import { UpdateUserTokenDto } from './dto/update-user-token.dto.js';
import { RegisterUserTokenDto } from './dto/register-user-token.dto.js';
import { FirebaseService } from '../notification/providers/firebase/firebase.service.js';
import { NotificationModel } from './model/notification.model.js';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(UserToken)
    private readonly notificationRepo: Repository<UserToken>,
    @Inject()
    private readonly firebaseService: FirebaseService,
  ) {}

  private logger = new Logger(NotificationService.name);

  findAll() {
    return this.notificationRepo.find();
  }

  async sendNotification(
    userId: string,
    deviceId: string,
    data: NotificationModel,
  ) {
    const token = await this.notificationRepo.findOne({
      where: {
        userId: userId,
        deviceId: deviceId,
      },
    });

    if (!token) {
      this.logger.error(
        `Cannot find token for userId=${userId}, deviceId=${deviceId}`,
      );
    }

    if (!token.isEnabled) {
      return;
    }

    this.firebaseService.send({
      token: token.token,
      notification: data,
    });
  }

  async registerToken(
    userId: string,
    deviceId: string,
    request: RegisterUserTokenDto,
  ) {
    // Check if entry with same userId and deviceId already exists
    const existingToken = await this.notificationRepo.findOne({
      where: {
        userId: userId,
        deviceId: deviceId,
      },
    });

    if (existingToken) {
      // Override existing entry by updating the token
      return this.notificationRepo.update(
        { userId, deviceId },
        { token: request.token },
      );
    }

    // Create new entry
    const userToken = new UserToken();
    userToken.userId = userId;
    userToken.deviceId = deviceId;
    userToken.token = request.token;

    return this.notificationRepo.save(userToken);
  }

  unregisterToken(userId: string, deviceId: string) {
    return this.notificationRepo.delete({
      userId: userId,
      deviceId: deviceId,
    });
  }

  updateUserToken(
    userId: string,
    deviceId: string,
    request: UpdateUserTokenDto,
  ) {
    return this.notificationRepo.update(
      {
        userId: userId,
        deviceId: deviceId,
      },
      {
        isEnabled: request.isEnabled,
      },
    );
  }
}
