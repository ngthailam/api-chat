import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class ChatMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  member: User;

  @ManyToOne(() => Chat)
  chat: Chat;

  @Column({ nullable: true })
  nickName?: string;

  @Column()
  role: 'admin' | 'member';
}
