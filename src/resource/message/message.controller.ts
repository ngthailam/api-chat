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
import { CurrentUser } from '../../common/decorator/current-user.decorator.js';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateMessageDto } from './dto/update-message.dto.js';
import {
  mapMessageListModelToResponse,
  MessageListResponse,
} from './response/message-list.response.js';
import { mapMessageModelToResponse } from './response/message.response.js';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // TODO: remove this API, it's for testing
  @Get('')
  findAll() {
    return this.messageService.findAll();
  }

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
  async createTextMessage(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Body()
    body: {
      text: string;
      quoteMessageId?: string | null;
      quoteMessageText?: string | null;
    },
  ) {
    const model = await this.messageService.createTextMessage(
      chatId,
      user.userId,
      body.text,
      body.quoteMessageId,
      body.quoteMessageText,
    );
    return mapMessageModelToResponse(model);
  }

  @Post('chat/:chatId/messages/poll')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        options: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  createPollMessage(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Body()
    body: {
      question: string;
      options: string[];
    },
  ) {
    return this.messageService.createPollMessage(
      chatId,
      user.userId,
      body.question,
      body.options,
    );
  }

  @Post('chat/:chatId/messages/:messageId/vote')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        option: { type: 'string' },
      },
      required: ['option'],
    },
  })
  votePollMessage(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() body: { option: string },
  ) {
    return this.messageService.votePollMessage(
      chatId,
      messageId,
      user.userId,
      body.option,
    );
  }

  @Get('chat/:chatId/messages')
  @ApiParam({ name: 'chatId', required: true })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findOlderMessagesInChat(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<MessageListResponse> {
    const model = await this.messageService.findOlderMessagesInChat(
      user.userId,
      chatId,
      +limit || 20,
      cursor,
    );
    return mapMessageListModelToResponse(model);
  }

  @Get('chat/:chatId/messages/new')
  @ApiParam({ name: 'chatId', required: true })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findNewerMessagesInChat(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<MessageListResponse> {
    const model = await this.messageService.findNewerMessagesInChat(
      user.userId,
      chatId,
      +limit || 20,
      cursor,
    );
    return mapMessageListModelToResponse(model);
  }

  @Get('chat/:chatId/messages/:messageId/surrounding')
  @ApiParam({ name: 'chatId', required: true })
  @ApiParam({ name: 'messageId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  findSurroundingMessages(
    @CurrentUser() user: { userId: string },
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Query('limit') limit: number = 20,
  ) {
    return this.messageService.findSurroundingMessages(
      user.userId,
      chatId,
      messageId,
      +limit,
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
