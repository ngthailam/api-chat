import { ChatMemberEntity } from '../entities/chat-member.entity.js';

export class ChatMember {
  id: number;

  nickName?: string;

  role: 'admin' | 'member';
}

export function mapChatMemberEntityToModel(
  chatMemberEntity: ChatMemberEntity,
): ChatMember {
  return {
    id: chatMemberEntity.id,
    nickName: chatMemberEntity.nickName,
    role: chatMemberEntity.role,
  };
}
