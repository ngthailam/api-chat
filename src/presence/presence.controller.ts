import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { GetPresenecsDto } from './dto/get-presences.dto';

@Controller('presence')
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post()
  async getStatuses(@Body() request: GetPresenecsDto) {
    return this.presenceService.getOnlineStatuses(request.userIdDeviceIdPairs);
  }
}
  