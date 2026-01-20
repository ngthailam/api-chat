import { ChatMember } from '../entities/chat-member';
import { Chat } from '../entities/chat.entity';
import { ChatMemberDto } from './chat-member.dto';

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
