import { ChatType } from '../dto/chat-type.js';
import { ChatMemberEntity } from '../entities/chat-member.entity.js';
import { ChatEntity } from '../entities/chat.entity.js';
import { ChatMember, mapChatMemberEntityToModel } from './chat-member.model.js';

export class Chat {
  id: string;

  name?: string;

  type: ChatType;

  members: ChatMember[];
}

export function mapChatEntityToModel(
  chatEntity: ChatEntity,
  members: ChatMemberEntity[] = null,
): Chat {
  console.log(`Mapping chat entity ${chatEntity} with members ${members} to model`);
  return {
    id: chatEntity.id,
    name: chatEntity.name,
    type: chatEntity.type,
    members: members
      ? members.map((member) => mapChatMemberEntityToModel(member))
      : null,
  };
}
