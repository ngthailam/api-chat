import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'friend_requests' })
@Index('unique_friend_request_pair', ['senderId', 'receiverId'], {
  unique: true,
})
export class FriendRequestEntity {
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
