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
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createChatDto: CreateChatDto) {
    return this.chatService.create(user.userId, createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
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
  ) {
    return this.chatService.addMembers(user.userId, id, memberIds);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.chatService.removeMember(user.userId, id, memberId);
  }

  @Patch(':id/rename')
  renameChat(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('newName') newName: string,
  ) {
    return this.chatService.renameChat(user.userId, id, newName);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.chatService.remove(user.userId, id);
  }

  @Delete('dev/delete/all')
  removeAll() {
    return this.chatService.removeAll();
  }
}
