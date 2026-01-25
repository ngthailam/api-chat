import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index('unique_friend_request_pair', ['senderId', 'receiverId'], {
  unique: true,
})
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: string;

  @Column()
  receiverId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'accept' | 'reject' = 'pending';

  @Column({ nullable: true })
  respondAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
