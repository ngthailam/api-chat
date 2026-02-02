import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ReactionType } from '../model/reaction-type';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

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
}
