import { ChatMember } from '../entities/chat-member.js';

export class ChatMemberDto {
  id: string;

  email: string;

  nickName?: string;

  role: 'admin' | 'member';

  static fromEntity(cm: ChatMember): ChatMemberDto {
    const chatMemberDto = new ChatMemberDto();
    chatMemberDto.id = cm.member.id;
    chatMemberDto.email = cm.member.email;
    chatMemberDto.nickName = cm.nickName;
    chatMemberDto.role = cm.role;
    return chatMemberDto;
  }
}
