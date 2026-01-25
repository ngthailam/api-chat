import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guard/jwt.guard';
import { MessageModule } from './message/message.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432, // default Postgres port
      username: 'lam',
      password: '', // if you haven’t set one
      database: 'api_chat',
      autoLoadEntities: true,
      synchronize: true, // TODO: remove on Prod
    }),
    UserModule,
    ChatModule,
    AuthModule,
    MessageModule,
    FriendRequestModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
