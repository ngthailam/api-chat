import { MessageType } from '../message-type.js';
import { MessageEntity } from '../../entities/message.entity.js';
import {
  BaseMessage,
  mapMessageInfoEntityToModel,
  mapQuoteEntityToModel,
} from '../message.model.js';
import { mapReactionsEntityToModel } from '../reaction.model.js';
import { MessageEntityPollExtraData } from '../../entities/message-poll-extra-data.entity.js';

export interface PollMessage extends BaseMessage {
  type: MessageType.POLL;
  question: string;
  options: PollMessageOption[];
  expireAt?: Date;
  isExpired: boolean;
}

export class PollMessageOption {
  option: string;
  // For now just id, since username and avatarUrl are not implemented yet
  voters: { id: string; username: string; avatarUrl: string }[];
}

export function mapPollMessageEntityToModel(
  message: MessageEntity,
): PollMessage {
  const extraData = message.extraData as MessageEntityPollExtraData;
  return {
    type: MessageType.POLL,
    question: extraData.question,
    options: extraData.options.map((opt) => ({
      option: opt.option,
      voters: opt.voters,
    })),
    expireAt: extraData.expireAt,
    isExpired: extraData.isExpired ? extraData.isExpired : false,
    info: mapMessageInfoEntityToModel(message),
    reaction: mapReactionsEntityToModel(message.reactions),
    quote: mapQuoteEntityToModel(message),
  };
}
