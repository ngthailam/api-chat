import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import { MessageModule } from './message/message.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FriendModule } from './friend/friend.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeviceIdGuard } from './common/guard/device-id.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'), // default Postgres port
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'), // if you haven’t set one
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        retryAttempts: 3,
        migrations: ['dist/common/database/migrations/*.js'],
        migrationsTableName: 'migrations',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ChatModule,
    AuthModule,
    MessageModule,
    FriendRequestModule,
    FriendModule,
    NotificationModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
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
