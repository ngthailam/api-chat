import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { ChatModule } from './chat/chat.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module.js';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard.js';
import { MessageModule } from './message/message.module.js';
import { FriendRequestModule } from './friend-request/friend-request.module.js';
import { FriendModule } from './friend/friend.module.js';
import { NotificationModule } from './notification/notification.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeviceIdGuard } from './common/guard/device-id.guard.js';
import { PresenceModule } from './presence/presence.module.js';
import { RedisModule } from './redis/redis.module.js';
import { typeOrmConfig } from './common/database/typeorm.config.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true, // only here
      retryAttempts: 3, // only here
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

console.log(process.env.DATABASE_NAME);

