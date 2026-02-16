import { MessageModel } from './message.model.js';

export class MessageListModel {
  messages: MessageModel[];
  hasMore: boolean;
  nextCursor: string | null = null;
  total: number;
}
