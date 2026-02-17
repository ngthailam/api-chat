import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PresenceService } from './presence.service.js';
import { GetPresenecsDto } from './dto/get-presences.dto.js';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  async getStatuses(@Body() request: GetPresenecsDto) {
    return this.presenceService.getOnlineStatuses(request.userIdDeviceIdPairs);
  }
}
  