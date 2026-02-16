import { MessageListModel } from '../model/message-list.model.js';
import {
  mapMessageModelToMessageResponse,
  MessageResponse,
} from './message.response.js';

export type MessageListResponse = {
  messages: MessageResponse[];
  hasMore: boolean;
  nextCursor?: string | null;
  total: number;
};

export function mapMessageListModelToResponse(
  model: MessageListModel,
): MessageListResponse {
  return {
    messages: model.messages.map(mapMessageModelToMessageResponse),
    hasMore: model.hasMore,
    nextCursor: model.nextCursor,
    total: model.total,
  };
}
