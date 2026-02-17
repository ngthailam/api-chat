import { Message } from './message.model.js';

export class MessageListModel {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null = null;
  total: number;
}
