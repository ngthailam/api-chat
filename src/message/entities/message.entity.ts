import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import { ReactionType } from '../model/reaction-type.js';

@Entity()
@Index(['chatId', 'id'])
export class Message {
  @PrimaryColumn('uuid')
  id: string;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  @Column()
  text: string;

  // 👇 DO NOT try to set this in app code
  @Column({
    type: 'tsvector',
    select: false,
    nullable: true,
  })
  searchVector: string;

  @Column()
  senderId: string;

  @Column()
  chatId: string;

  @Column({ type: 'jsonb', default: {} })
  reactions: Record<string, ReactionType>;

  @Column()
  createdAt: Date;

  /**
   * Do this instead of quoteMessageId to reduce queries when fetching messages with quotes.
   * This is a denormalization for performance optimization.
   */
  @Column({ default: null, nullable: true })
  quoteMessageId: string | null;

  @Column({ default: null, nullable: true })
  quoteMessageText: string | null;
}