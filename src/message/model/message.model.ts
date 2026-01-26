import { Message } from '../entities/message.entity';
import { ReactionType } from './reaction-type';

export type MessageModel = {
  message: MessageBasicInfoModel;
  reaction: ReactionModel;
};

export type MessageBasicInfoModel = {
  id: number;
  text: string;
  senderId: string;
  chatId: string;
  createdAt: Date;
};

export function mapMessageModel(message: Message): MessageModel {
  return {
    message: {
      id: message.id,
      text: message.text,
      senderId: message.senderId,
      chatId: message.chatId,
      createdAt: message.createdAt,
    },
    reaction: mapReactionsToModel(message.reactions),
  };
}

export type ReactionModel = {
  /**
   * @key ReactionType type of reaction
   * @value the total count of that ReactionType
   *
   */
  count: Record<ReactionType, number>;

  /**
   * @key userId in string
   * @value ReactionType type of reaction
   */
  sender: Record<string, ReactionType>;
};

export function mapReactionsToModel(
  reactions: Record<string, ReactionType> | null | undefined,
): ReactionModel {
  const count = {} as Record<ReactionType, number>;
  const sender = {} as Record<string, ReactionType>;

  if (!reactions) {
    return { count, sender };
  }

  for (const [userId, reaction] of Object.entries(reactions)) {
    // count
    count[reaction] = (count[reaction] ?? 0) + 1;

    // sender (store last sender; see note below)
    sender[userId] = reaction;
  }

  return { count, sender };
}
