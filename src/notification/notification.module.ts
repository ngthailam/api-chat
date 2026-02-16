import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service.js';
import { NotificationController } from './notification.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTokenEntity } from './entity/user-token.entity.js';
import { FirebaseModule } from '../notification/providers/firebase/firebase.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserTokenEntity]), FirebaseModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
