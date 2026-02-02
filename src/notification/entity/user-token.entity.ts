import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity()
@Unique(['userId', 'deviceId'])
export class UserToken {
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
