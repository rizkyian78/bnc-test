import {
  Entity,
  Column,
  Generated,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Users } from './user.entity';

@Entity()
export class Credentials {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  firstVerificationOTP: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Users, (user) => user.credentials)
  user: Users;
}
