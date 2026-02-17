import { ChatMember } from '../model/chat-member.model.js';

export class ChatMemberDto {
  id: number;

  nickName?: string;

  role: 'admin' | 'member';
}

export function mapChatMemberModelToDto(cm: ChatMember): ChatMemberDto {
  const chatMemberDto = new ChatMemberDto();
  chatMemberDto.id = cm.id;
  chatMemberDto.nickName = cm.nickName;
  chatMemberDto.role = cm.role;
  return chatMemberDto;
}
