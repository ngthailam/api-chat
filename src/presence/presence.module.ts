import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service.js';
import { PresenceGateway } from './presence.gateway.js';
import { PresenceController } from './presence.controller.js';

@Module({
  providers: [PresenceService, PresenceGateway],
  controllers: [PresenceController],
  exports: [PresenceService],
})
export class PresenceModule {}
