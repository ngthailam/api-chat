import { MessageEntity } from '../../entities/message.entity.js';
import { MessageType } from '../message-type.js';
import {
  BaseMessage,
  mapMessageInfoEntityToModel,
  mapQuoteEntityToModel,
} from '../message.model.js';
import { mapReactionsEntityToModel } from '../reaction.model.js';

export interface TextMessage extends BaseMessage {
  type: MessageType.TEXT;
  text: string;
}

export function mapTextMessageEntityToModel(
  message: MessageEntity,
): TextMessage {
  return {
    type: MessageType.TEXT,
    text: message.text || '',
    info: mapMessageInfoEntityToModel(message),
    reaction: mapReactionsEntityToModel(message.reactions),
    quote: mapQuoteEntityToModel(message),
  };
}
