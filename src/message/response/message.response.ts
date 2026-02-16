import { MessageModel } from '../model/message.model.js';
import { ReactionType } from '../model/reaction-type.js';

export type MessageResponse = {
  message: MessageBasicInfoResponse;
  reaction: ReactionResponse;
  quote?: MessageQuoteResponse;
};

export type MessageBasicInfoResponse = {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  createdAt: Date;
};

export type MessageQuoteResponse = {
  type: 'text';
  messageId: string;
  text: string;
};

export type ReactionResponse = {
  count: Record<ReactionType, number>;
  sender: Record<string, ReactionType>;
};

export function mapMessageModelToMessageResponse(
  model: MessageModel,
): MessageResponse {
  return {
    message: {
      id: model.message.id,
      text: model.message.text,
      senderId: model.message.senderId,
      chatId: model.message.chatId,
      createdAt: model.message.createdAt,
    },
    reaction: {
      count: model.reaction.count,
      sender: model.reaction.sender,
    },
    quote: {
      type: model.quote?.type,
      messageId: model.quote?.messageId,
      text: model.quote?.text,
    }
  };
}
