import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChatType } from '../dto/chat-type';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ default: ChatType.GROUP })
  type: ChatType;
}
