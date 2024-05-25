import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Generated,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class TransactionDetails {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column('numeric', { precision: 16, scale: 2 })
  toAccount: string;

  @Column()
  toAccountName: string;

  @Column()
  toBankName: string;

  @Column()
  transferAmount: string;

  @Column('uuid', { nullable: true })
  transactionId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
