import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { PresenceGateway } from './presence.gateway';
import { PresenceController } from './presence.controller';

@Module({
  providers: [PresenceService, PresenceGateway],
  controllers: [PresenceController],
  exports: [PresenceService],
})
export class PresenceModule {}
