import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { AppService } from './app.service';

import Config from 'src/config/config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  getHello(): string {
    return this.appService.getHello();
  }
}
