import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { CreateChatDto } from './dto/create-chat.dto.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ChatDto, mapChatModelToDto } from './dto/chat.dto.js';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createChatDto: CreateChatDto,
  ): Promise<ChatDto> {
    const model = await this.chatService.create(user.userId, createChatDto);
    return mapChatModelToDto(model);
  }

  @Get()
  async findAll(): Promise<ChatDto[]> {
    const chats = await this.chatService.findAll();
    return chats.map((chat) => mapChatModelToDto(chat));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ChatDto> {
    const chat = await this.chatService.findOne(id);
    return mapChatModelToDto(chat);
  }

  @Post(':id/members')
  @ApiBody({
    schema: {
      properties: { memberIds: { type: 'array', items: { type: 'string' } } },
    },
  })
  addMembers(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('memberIds') memberIds: string[],
  ): Promise<void> {
    return this.chatService.addMembers(user.userId, id, memberIds);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ): Promise<void> {
    return this.chatService.removeMember(user.userId, id, memberId);
  }

  @Patch(':id/rename')
  async renameChat(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('newName') newName: string,
  ): Promise<ChatDto> {
    const chat = await this.chatService.renameChat(user.userId, id, newName);
    return mapChatModelToDto(chat);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string): Promise<void> {
    return this.chatService.remove(user.userId, id);
  }

  @Delete('dev/delete/all')
  removeAll(): Promise<void> {
    return this.chatService.removeAll();
  }
}
