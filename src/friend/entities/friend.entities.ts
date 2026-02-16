import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * To save resource, user1 and user2 ids will be sorted (user1Id > user2Id in terms of string comparison)
 */
@Entity({ name: 'friends' })
@Index(['user1Id', 'user2Id'], { unique: true })
export class FriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1Id: string;

  @Column()
  user2Id: string;

  @CreateDateColumn()
  createdAt: Date;
}
