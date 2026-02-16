import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import {
  mapMessageListModelToResponse,
  MessageListResponse,
} from './response/message-list.response.js';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // TODO: remove this API, it's for testing
  @Get('')
  findAll() {
    return this.messageService.findAll();
  }

  // TODO: remove this API, it's for testing
  @Post('chat/:chatId/messages')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        quoteMessageId: { type: 'string', nullable: true },
        quoteMessageText: { type: 'string', nullable: true },
      },
      required: ['text'],
    },
  })
  createMessage(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Body()
    body: {
      text: string;
      quoteMessageId?: string | null;
      quoteMessageText?: string | null;
    },
  ) {
    return this.messageService.createMessage(
      chatId,
      user.userId,
      body.text,
      body.quoteMessageId,
      body.quoteMessageText,
    );
  }

  @Get('chat/:chatId/messages')
  @ApiParam({ name: 'chatId', required: true })
  async findMessagesInChat(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
  ): Promise<MessageListResponse> {
    const model = await this.messageService.findAllInChat(user.userId, chatId);
    return mapMessageListModelToResponse(model);
  }

  @Get('chat/:chatId/messages/:messageId/surrounding')
  @ApiParam({ name: 'chatId', required: true })
  @ApiParam({ name: 'messageId', required: true })
  findSurroundingMessages(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
  ) {
    return this.messageService.findSurroundingMessages(
      user.userId,
      chatId,
      messageId,
    );
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
    return this.messageService.remove(user.userId, messageId);
  }

  @Patch(':messageId')
  update(
    @CurrentUser() user: { userId: string },
    @Param('messageId') messageId: string,
    @Body() request: UpdateMessageDto,
  ) {
    return this.messageService.update(user.userId, messageId, request);
  }
}
