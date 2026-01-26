import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReactionType } from '../model/reaction-type';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  senderId: string;

  @Column()
  chatId: string;

  @Column({ type: 'jsonb', default: {} })
  reactions: Record<string, ReactionType>;

  @Column()
  createdAt: Date;
}
