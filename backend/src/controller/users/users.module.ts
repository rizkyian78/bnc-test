import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/model';
import { Credentials } from 'src/model/credential.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import Config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Credentials]),
    JwtModule.register({
      global: true,
      secret: Config().jwt.secret,
      signOptions: { expiresIn: Config().jwt.expired },
    }),
    ConfigModule.forRoot({
      load: [Config],
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [Config().broker.path], // Replace with your RabbitMQ URL
          queue: 'register.email',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
