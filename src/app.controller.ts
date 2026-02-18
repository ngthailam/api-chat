import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { Public } from './common/guard/jwt.guard.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('testRedis')
  @Public()
  async testRedis(): Promise<string> {
    return this.appService.testRedis();
  }
}
