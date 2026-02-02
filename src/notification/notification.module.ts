import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entity/user-token.entity';
import { FirebaseModule } from 'src/notification/providers/firebase/firebase.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken]), FirebaseModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
