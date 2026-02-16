import { ChatMember } from '../entities/chat-member.js';
import { Chat } from '../entities/chat.entity.js';
import { ChatMemberDto } from './chat-member.dto.js';

export class ChatDto {
  id: string;

  name?: string;

  members: ChatMemberDto[];

  static fromEntity(entity: Chat, members: ChatMember[]): ChatDto {
    const dto = new ChatDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.members = members.map((cm) => ChatMemberDto.fromEntity(cm));
    return dto;
  }
}
