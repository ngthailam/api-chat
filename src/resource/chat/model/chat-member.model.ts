import { ChatMemberEntity } from '../entities/chat-member.entity.js';

export class ChatMember {
  id: string;

  nickName?: string;

  role: 'admin' | 'member';
}

export function mapChatMemberEntityToModel(
  chatMemberEntity: ChatMemberEntity,
): ChatMember {
  console.log(`Mapping chat member entity ${JSON.stringify(chatMemberEntity)} to model`);
  return {
    id: chatMemberEntity.member.id,
    nickName: chatMemberEntity.nickName,
    role: chatMemberEntity.role,
  };
}
