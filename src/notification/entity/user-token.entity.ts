import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity({ name: 'user_tokens' })
@Unique(['userId', 'deviceId'])
export class UserTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  deviceId: string;

  @Column()
  token: string;

  @Column({ default: true })
  isEnabled: boolean = true;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
