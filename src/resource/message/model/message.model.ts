import { MessageEntity } from '../entities/message.entity.js';
import { MessageType } from './message-type.js';
import {
  mapPollMessageEntityToModel,
  PollMessage,
} from './poll/message-poll.model.js';
import { Reaction } from './reaction.model.js';
import {
  mapTextMessageEntityToModel,
  TextMessage,
} from './text/message-text.model.js';

export type Message = TextMessage | PollMessage;
///
export interface BaseMessage {
  info: MessageBasicInfo;
  reaction: Reaction;
  quote?: MessageQuote;
}

export class MessageBasicInfo {
  id: string;
  chatId: string;
  senderId: string;
  createdAt: Date;
}

export class MessageQuote {
  type: 'text';
  messageId: string;
  text: string;
}

export function mapMessageEntityToModel(message: MessageEntity): Message {
  switch (message.type) {
    case MessageType.TEXT:
      return mapTextMessageEntityToModel(message);
    case MessageType.POLL:
      return mapPollMessageEntityToModel(message);
    default:
      throw new Error(`Unsupported message type: ${message.type}`);
  }
}

export function mapMessageInfoEntityToModel(
  message: MessageEntity,
): MessageBasicInfo {
  return {
    id: message.id,
    senderId: message.senderId,
    chatId: message.chatId,
    createdAt: message.createdAt,
  };
}

export function mapQuoteEntityToModel(
  message: MessageEntity,
): MessageQuote | null {
  if (!message.quoteMessageId) {
    return null;
  }

  return {
    type: 'text',
    messageId: message.quoteMessageId,
    text: message.quoteMessageText,
  };
}
