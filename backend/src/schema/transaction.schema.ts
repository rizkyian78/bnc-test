import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { InstructionType, Statuses } from 'src/const/enum';

export class FundTransferSchema {
  @IsNotEmpty()
  transferAmount: number;

  @IsNotEmpty()
  totalRecord: number;

  @IsNotEmpty()
  @IsUUID()
  transactionId: string;

  @IsNotEmpty()
  @IsEnum(InstructionType)
  instructionType: InstructionType;

  expiredDate: string;
  expiredTime: string;
}

export class SubmitTransactionSchema {
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;

  @IsNotEmpty()
  totalAmount: number;

  @IsNotEmpty()
  totalRecord: number;
}

export class UpdateTransactionStatusSchema {
  @IsNotEmpty()
  @IsEnum(Statuses)
  status: Statuses;
}
