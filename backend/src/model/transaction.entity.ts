import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Generated,
  PrimaryColumn,
} from 'typeorm';
import { Statuses, InstructionType, TransferTypes } from '../const/enum';

@Entity()
@Index(['created_at', 'updated_at', 'status', 'fromAccount'])
export class Transactions {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column('numeric', { precision: 16, scale: 2 })
  transferAmount: number;

  @Column()
  transferRecord: number;

  @Column()
  fromAccount: string;

  @Column()
  fromUser: string;

  @Column({ type: 'enum', enum: Statuses, nullable: true })
  status: Statuses;

  @Column({ type: 'enum', enum: InstructionType, nullable: true })
  instructionType: InstructionType;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @Column({ nullable: true })
  expiredDate: string;

  @Column({ nullable: true })
  expiredTime: string;

  @Column({
    type: 'enum',
    enum: TransferTypes,
    nullable: true,
    default: TransferTypes.ONLINE,
  })
  transferType: TransferTypes;
}
