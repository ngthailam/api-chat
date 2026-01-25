import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('')
  findOne(@CurrentUser() user: any, @Query('chatId') chatId: string) {
    return this.messageService.findAllInChat(user.userId, chatId);
  }

  @Delete(':messageId')
  remove(@CurrentUser() user: any, @Param('messageId') messageId: string) {
    return this.messageService.remove(user.userId, +messageId);
  }
}
