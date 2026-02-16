import { MessageEntity } from '../entities/message.entity.js';
import { mapReactionsToModel, Reaction } from './reaction.model.js';

export class Message {
  message: MessageBasicInfo;
  reaction: Reaction;
  quote?: MessageQuote;
}

export class MessageBasicInfo {
  id: string;
  text: string;
  senderId: string;
  chatId: string;
  createdAt: Date;
}

export class MessageQuote {
  type: 'text';
  messageId: string;
  text: string;
}

export function mapMessageModel(message: MessageEntity): Message {
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

function mapQuoteToModel(message: MessageEntity): MessageQuote | null {
  if (!message.quoteMessageId) {
    return null;
  }

  return {
    type: 'text',
    messageId: message.quoteMessageId,
    text: message.quoteMessageText,
  };
}
