import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions, Users } from 'src/model';
import { TransactionDetails } from 'src/model/transfer-detail.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

import Config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transactions, Users, TransactionDetails]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      host: Config().redis.host, // Redis server host
      port: Config().redis.port, // Redis server port
      ttl: Config().redis.ttl,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', '../', 'assets'),
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
