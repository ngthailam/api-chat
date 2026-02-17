import { Message } from './message.model.js';

export class MessageList {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null = null;
  total: number;
}
