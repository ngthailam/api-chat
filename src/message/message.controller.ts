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
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // TODO: remove this API, it's for testing
  @Get('')
  findAll() {
    return this.messageService.findAll();
  }

  @Get('chat/:chatId/messages')
  @ApiParam({ name: 'chatId', required: true })
  findMessagesInChat(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
  ) {
    return this.messageService.findAllInChat(user.userId, chatId);
  }

  @Get('chat/:chatId/messages/search')
  @ApiQuery({ name: 'keyword', required: true })
  @ApiParam({ name: 'chatId', required: true })
  searchInChat(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Query('keyword') keyword: string,
  ) {
    return this.messageService.searchInChat(user.userId, chatId, keyword);
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
