import { Chat } from '../model/chat.model.js';
import { ChatMemberDto, mapChatMemberModelToDto } from './chat-member.dto.js';

export class ChatDto {
  id: string;

  name?: string;

  members: ChatMemberDto[];
}

export function mapChatModelToDto(chat: Chat): ChatDto {
  const dto = new ChatDto();
  dto.id = chat.id;
  dto.name = chat.name;
  dto.members = chat.members.map((cm) => mapChatMemberModelToDto(cm));
  return dto;
}
