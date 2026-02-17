import { MessageList } from '../model/message-list.model.js';
import {
  mapMessageModelToResponse,
  MessageResponse,
} from './message.response.js';

export type MessageListResponse = {
  messages: MessageResponse[];
  hasMore: boolean;
  nextCursor?: string | null;
  total: number;
};

export function mapMessageListModelToResponse(
  model: MessageList,
): MessageListResponse {
  return {
    messages: model.messages.map(mapMessageModelToResponse),
    hasMore: model.hasMore,
    nextCursor: model.nextCursor,
    total: model.total,
  };
}
