import { Roles, Statuses, UserStatus } from 'src/const/enum';
import {
  Entity,
  Column,
  Generated,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  OneToOne,
  Index,
} from 'typeorm';

import { Transactions } from './transaction.entity';
import { Credentials } from './credential.entity';

@Entity()
@Index(['created_at', 'updated_at', 'corporateAccountNo'])
export class Users {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ type: 'enum', enum: Roles, nullable: true })
  role: Roles;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ nullable: true })
  corporateName: string;

  @Column({ nullable: true })
  corporateAccountNo: string;

  @Column({ nullable: true })
  phoneNo: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'uk' })
  lang: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Credentials, (credential) => credential.user)
  credentials: Credentials;

  @OneToMany(() => Transactions, (transaction) => transaction.fromUser)
  transactions: Transactions[];
}

export interface SessionUser {
  id: string;
  userName: string;
  role: Roles;
  corporateName: string;
  corporateAccountNo: string;
  loginTime: string;
  iat: number;
  exp: number;
}
