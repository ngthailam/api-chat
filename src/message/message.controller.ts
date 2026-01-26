import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('')
  findOne(
    @CurrentUser() user: { userId: string },
    @Query('chatId') chatId: string,
  ) {
    return this.messageService.findAllInChat(user.userId, chatId);
  }

  @Delete(':messageId')
  remove(
    @CurrentUser() user: { userId: string },
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.remove(user.userId, +messageId);
  }

  @Patch(':messageId')
  update(
    @CurrentUser() user: { userId: string },
    @Param('messageId') messageId: string,
    @Body() request: UpdateMessageDto,
  ) {
    return this.messageService.update(user.userId, +messageId, request);
  }
}
