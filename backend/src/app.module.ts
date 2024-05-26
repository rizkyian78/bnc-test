import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controller/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credentials } from './model/credential.entity';
import { Transactions, Users } from './model';
import { TransactionsModule } from './controller/transactions/transactions.module';
import { TransactionDetails } from './model/transfer-detail.entity';

import Config from './config/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      load: [Config],
      isGlobal: true,
    }),
    TransactionsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Config().db.host,
      port: Config().db.port,
      username: Config().db.username,
      password: Config().db.password,
      database: Config().db.name,
      entities: [Users, Credentials, Transactions, TransactionDetails],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Users,
      Credentials,
      Transactions,
      TransactionDetails,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
