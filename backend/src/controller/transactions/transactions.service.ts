import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionUser, TransactionDetails, Transactions } from 'src/model';
import {
  FundTransferSchema,
  SubmitTransactionSchema,
  UpdateTransactionStatusSchema,
} from 'src/schema/transaction.schema';
import {
  CSVData,
  RedisSaveValue,
  getJsonCSV,
} from 'src/utils/sheet-reader.utils';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';
import { InstructionType, Roles, Statuses } from 'src/const/enum';
import * as dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import * as _ from 'lodash';
import { monitorSqlQuery } from 'src/const/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

interface TransactionSummary {
  totalRecord: number;
  totalAmount: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,

    @InjectRepository(TransactionDetails)
    private transactionDetailRepository: Repository<TransactionDetails>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async upload(file: Express.Multer.File, user: SessionUser) {
    const data = await getJsonCSV(file.path);

    let reject = 0;

    const transactionId = randomUUID();

    for (const item of data) {
      if (
        !item.to_account_name ||
        !item.to_account_no ||
        !item.to_bank ||
        !item.transfer_amount
      ) {
        reject += 1;
      }
    }

    if (reject > 0) {
      return {
        message: `After detection, there are ${data.length} record, and ${reject} records error no match header. Please reupload your resume`,
        ok: false,
        total: data.length,
        reject: reject,
      };
    }

    // @ts-ignore
    const result = this.summarizeTransactions(data);
    const redisValue: RedisSaveValue = {
      totalRecord: result.totalRecord,
      totalAmount: result.totalAmount,
      data,
    };
    await this.cacheManager.set(transactionId + '_upload', redisValue);

    return {
      message: `After detection, there are ${result.totalRecord} record, the total Transfer amount is  Rp.${result.totalAmount}`,
      transactionId,
      ok: true,
      ...result,
      data,
    };
  }

  async validate(payload: FundTransferSchema, user: SessionUser) {
    const transactionDetails: RedisSaveValue = await this.cacheManager.get(
      payload.transactionId + '_upload',
    );

    if (!transactionDetails) {
      throw new NotFoundException('Transaction Not found');
    }

    if (
      transactionDetails.totalAmount !== Number(payload.transferAmount) ||
      transactionDetails.totalRecord !== Number(payload.totalRecord)
    ) {
      throw new BadRequestException('Invalid Transaction');
    }

    const transaction = await this.transactionRepository.create({
      id: payload.transactionId,
      transferAmount: payload.transferAmount,
      transferRecord: payload.totalRecord,
      fromUser: user.userName,
      fromAccount: user.corporateAccountNo,
    });

    transactionDetails.data.map((v, i) => {
      this.transactionDetailRepository.save({
        transactionId: payload.transactionId,
        toAccount: v.to_account_no,
        toAccountName: v.to_account_name,
        toBankName: v.to_bank,
        transferAmount: v.transfer_amount,
      });
    });

    if (payload.instructionType === InstructionType.STANDING_INSTRUCTION) {
      if (!payload.expiredDate && !payload.expiredTime) {
        throw new BadRequestException('Should send transfer date');
      }
      transaction.expiredDate = payload.expiredDate;
      transaction.expiredTime = payload.expiredTime;
    }
    transaction.instructionType = payload.instructionType;
    transaction.status = Statuses.VALIDATED;

    await this.transactionRepository.save(transaction);

    return transaction;
  }

  async submit(payload: SubmitTransactionSchema, user: SessionUser) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: payload.transactionId,
      },
    });

    if (![Statuses.VALIDATED].includes(transaction.status)) {
      throw new BadRequestException('Transaction already processed');
    }

    if (!transaction) {
      throw new NotFoundException('Transaction Not found');
    }

    if (
      transaction.transferAmount !== payload.totalAmount ||
      transaction.transferRecord !== payload.totalRecord
    ) {
      throw new BadRequestException('Invalid Transaction');
    }

    transaction.status = Statuses.PENDING;

    if (user.role === Roles.APPROVER) {
      transaction.status = Statuses.APPROVED;
    }
    await this.transactionRepository.save(transaction);
    return transaction;
  }
  summarizeTransactions(transactions: CSVData[]): TransactionSummary {
    return transactions.reduce(
      (summary, transaction) => {
        return {
          totalRecord: summary.totalRecord + 1,
          totalAmount:
            summary.totalAmount + parseFloat(transaction.transfer_amount),
        };
      },
      { totalRecord: 0, totalAmount: 0 },
    );
  }

  async monitor(page: number, limit: number) {
    const [entities, total] = await this.transactionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        created_at: {
          direction: 'DESC',
        },
      },
      where: {
        status: In([Statuses.APPROVED, Statuses.PENDING, Statuses.REJECTED]),
      },
    });

    const data = await this.transactionRepository.query(monitorSqlQuery);

    const totalPages = Math.ceil(total / limit);

    return {
      status: data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data: entities,
    };
  }

  async findOne(id: string) {
    return this.transactionRepository.findOneBy({ id });
  }

  async update(id: string, payload: UpdateTransactionStatusSchema) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction Not found');
    }

    if ([Statuses.APPROVED, Statuses.REJECTED].includes(transaction.status)) {
      throw new BadRequestException('Transaction already processed');
    }

    transaction.status = payload.status;

    await this.transactionRepository.save(transaction);

    return transaction;
  }

  async remove(id: string) {
    await this.transactionRepository.delete({
      id,
    });
    return `This action removes a #${id} transaction`;
  }

  async allTransactionDetail(id: string, page: number, limit: number) {
    const [entities, total] =
      await this.transactionDetailRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: {
          created_at: {
            direction: 'DESC',
          },
        },
        where: {
          transactionId: id,
        },
      });

    const totalPages = Math.ceil(total / limit);

    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });
    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      transaction,
      data: entities,
    };
  }

  async findAll(page: number, limit: number, where: { [key: string]: string }) {
    let filter: FindOptionsWhere<Transactions> = {
      status: In([Statuses.APPROVED, Statuses.PENDING, Statuses.REJECTED]),
    };

    if (!_.isEmpty(where)) {
      if (where.startDate && where.endDate) {
        filter.created_at = Between(
          dayjs(where.startDate).startOf('D').toDate(),
          dayjs(where.endDate).endOf('D').toDate(),
        );
      }

      if (!_.isEmpty(where.status)) {
        filter.status = where.status as Statuses;
      }
      if (!_.isEmpty(where.fromAccountNo)) {
        filter.fromAccount = where.fromAccountNo;
      }
    }

    const [entities, total] = await this.transactionRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: {
        created_at: {
          direction: 'DESC',
        },
      },
      where: {
        ...filter,
      },
    });

    const totalPages = Math.ceil(total / limit);
    return {
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
      data: entities,
    };
  }
}
