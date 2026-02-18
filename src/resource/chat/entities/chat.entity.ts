import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChatType } from '../dto/chat-type.js';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: ChatType.GROUP })
  type: ChatType;

  // Used to quick check for one-to-one chat without extra query to chat_member table
  // Format: result of normalizeUserPair
  @Column({ nullable: true, unique: true })
  oneToOneUserIdPair?: string;
}
