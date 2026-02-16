import { MessageEntity } from '../entities/message.entity.js';
import { ReactionType } from './reaction-type.js';

export type MessageModel = {
  message: MessageBasicInfoModel;
  reaction: ReactionModel;
  quote?: MessageQuoteModel;
};

export type MessageBasicInfoModel = {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  createdAt: Date;
};

export type MessageQuoteModel = {
  type: 'text';
  messageId: string;
  text: string;
}

export function mapMessageModel(message: MessageEntity): MessageModel {
  return {
    message: {
      id: message.id,
      text: message.text,
      senderId: message.senderId,
      chatId: message.chatId,
      createdAt: message.createdAt,
    },
    reaction: mapReactionsToModel(message.reactions),
    quote: mapQuoteToModel(message),
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
function mapQuoteToModel(message: MessageEntity): MessageQuoteModel | null {
  if (!message.quoteMessageId) {
    return null;
  }
  
  return {
    type: 'text',
    messageId: message.quoteMessageId,
    text: message.quoteMessageText,
  }
}

