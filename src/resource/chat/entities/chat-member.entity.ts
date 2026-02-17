import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatEntity } from './chat.entity.js';
import { UserEntity } from '../../user/entities/user.entity.js';

@Entity({ name: 'chat_members' })
export class ChatMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  member: UserEntity;

  @ManyToOne(() => ChatEntity, { onDelete: 'CASCADE' })
  chat: ChatEntity;

  @Column({ nullable: true })
  nickName?: string;

  @Column()
  role: 'admin' | 'member';
}
