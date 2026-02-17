import { MessageType } from '../../model/message-type.js';
import { Message } from '../../model/message.model.js';
import { TextMessage } from '../../model/text/message-text.model.js';
import {
  BaseMessageResponse,
  mapMessageInfoModelToRespone,
  mapQuoteModelToResponse,
  mapReactionsModelToResponse,
} from '../message.response.js';

export interface TextMessageResponse extends BaseMessageResponse {
  type: MessageType.TEXT;
  text: string;
}

export function mapTextMessageModelToResponse(
  model: Message,
): TextMessageResponse {
  const message = model as TextMessage;

  return {
    type: MessageType.TEXT,
    text: message.text || '',
    info: mapMessageInfoModelToRespone(message.info),
    reaction: mapReactionsModelToResponse(message.reaction),
    quote: mapQuoteModelToResponse(message.quote),
  };
}
