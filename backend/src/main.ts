import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import Config from 'src/config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: Config().app.originHost, // Replace with the allowed origin(s)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(Config().app.port);
}
bootstrap();
