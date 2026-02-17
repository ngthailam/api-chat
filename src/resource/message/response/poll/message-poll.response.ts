import { MessageType } from '../../model/message-type.js';
import {
  BaseMessageResponse,
  mapMessageInfoModelToRespone,
  mapQuoteModelToResponse,
  mapReactionsModelToResponse,
} from '../message.response.js';
import { PollMessage } from '../../model/poll/message-poll.model.js';
import { Message } from '../../model/message.model.js';

export interface PollMessageResponse extends BaseMessageResponse {
  type: MessageType.POLL;
  question: string;
  options: {
    option: string;
    voters: { id: string; username: string; avatarUrl: string }[];
  }[];
}
export function mapPollMessageModelToResponse(
  model: Message,
): PollMessageResponse {
  const message = model as PollMessage;

  return {
    type: MessageType.POLL,
    question: message.question,
    options: message.options,
    info: mapMessageInfoModelToRespone(message.info),
    reaction: mapReactionsModelToResponse(message.reaction),
    quote: mapQuoteModelToResponse(message.quote),
  };
}
