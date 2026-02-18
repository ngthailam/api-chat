import { MessageType } from '../model/message-type.js';
import {
  Message,
  MessageBasicInfo,
  MessageQuote,
} from '../model/message.model.js';
import { ReactionType } from '../model/reaction-type.js';
import { Reaction } from '../model/reaction.model.js';
import {
  mapPollMessageModelToResponse,
  PollMessageResponse,
} from './poll/message-poll.response.js';
import {
  mapTextMessageModelToResponse,
  TextMessageResponse,
} from './text/message-text.response.js';

export type MessageResponse = TextMessageResponse | PollMessageResponse;
///
export interface BaseMessageResponse {
  info: MessageBasicInfoResponse;
  reaction: MessageReactionResponse;
  quote?: MessageQuoteResponse;
}

export class MessageBasicInfoResponse {
  id: string;
  chatId: string;
  senderId: string;
  createdAt: Date;
}

export type MessageQuoteResponse = {
  type: 'text';
  messageId: string;
  text: string;
};

export type MessageReactionResponse = {
  count: Record<ReactionType, number>;
  sender: Record<string, ReactionType>;
};

export function mapMessageModelToResponse(message: Message): MessageResponse {
  switch (message.type) {
    case MessageType.TEXT:
      return mapTextMessageModelToResponse(message);
    case MessageType.POLL:
      return mapPollMessageModelToResponse(message);
    default:
      throw new Error(`Unsupported message type: ${message}`);
  }
}

export function mapMessageInfoModelToRespone(
  message: MessageBasicInfo,
): MessageBasicInfoResponse {
  return {
    id: message.id,
    senderId: message.senderId,
    chatId: message.chatId,
    createdAt: message.createdAt,
  };
}

export function mapReactionsModelToResponse(
  reaction: Reaction,
): MessageReactionResponse {
  if (!reaction) {
    return {
      count: {} as Record<ReactionType, number>,
      sender: {} as Record<string, ReactionType>,
    };
  } 

  return {
    count: reaction.count,
    sender: reaction.sender,
  };
}

export function mapQuoteModelToResponse(
  quote: MessageQuote,
): MessageQuoteResponse | null {
  if (!quote) {
    return null;
  }

  if (!quote.messageId) {
    return null;
  }

  return {
    type: 'text',
    messageId: quote.messageId,
    text: quote.text,
  };
}
