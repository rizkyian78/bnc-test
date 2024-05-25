import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions, Users } from 'src/model';
import { TransactionDetails } from 'src/model/transfer-detail';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Users, TransactionDetails]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', '../', 'assets'),
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
