import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ChatModule } from './resource/chat/chat.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './resource/auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard.js';
import { MessageModule } from './resource/message/message.module.js';
import { FriendRequestModule } from './resource/friend-request/friend-request.module.js';
import { FriendModule } from './resource/friend/friend.module.js';
import { NotificationModule } from './resource/notification/notification.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeviceIdGuard } from './common/guard/device-id.guard.js';
import { PresenceModule } from './resource/presence/presence.module.js';
import { RedisModule } from './resource/redis/redis.module.js';
import { typeOrmConfig } from './common/database/typeorm.config.js';
import { UserModule } from './resource/user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
      retryAttempts: 3,
    }),
    UserModule,
    ChatModule,
    AuthModule,
    MessageModule,
    FriendRequestModule,
    FriendModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    PresenceModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: DeviceIdGuard,
    },
  ],
})
export class AppModule {}
