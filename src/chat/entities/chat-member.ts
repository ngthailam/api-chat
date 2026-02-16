import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity.js';
import { User } from '../../user/entities/user.entity.js';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  member: User;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  chat: Chat;

  @Column({ nullable: true })
  nickName?: string;

  @Column()
  role: 'admin' | 'member';
}
