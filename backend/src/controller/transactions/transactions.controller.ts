import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  Res,
  Header,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer';
import {
  FundTransferSchema,
  SubmitTransactionSchema,
  UpdateTransactionStatusSchema,
} from 'src/schema/transaction.schema';
import { allowedMimeTypes } from 'src/const/config';
import { join } from 'path';
import type { Response, Request } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAllTransaction(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('where') where: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 5) || 5;
    return this.transactionsService.findAll(
      pageNumber,
      limitNumber,
      JSON.parse(where),
    );
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  upload(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
    if (!file || !allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type or no file provided');
    }
    return this.transactionsService.upload(file, request['sessionUser']);
  }

  @Post('validate')
  @UseGuards(AuthGuard)
  validate(@Body() payload: FundTransferSchema) {
    return this.transactionsService.validate(payload);
  }

  @Post('confirm')
  @UseGuards(AuthGuard)
  confirm(@Body() payload: SubmitTransactionSchema, @Req() request: Request) {
    return this.transactionsService.submit(payload, request['sessionUser']);
  }

  @Get('monitor')
  @UseGuards(AuthGuard)
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.transactionsService.monitor(pageNumber, limitNumber);
  }
  @Get('files')
  @UseGuards(AuthGuard)
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getfile(@Res() res: Response) {
    const filePath = join(
      __dirname,
      '../',
      '../',
      '../',
      'public/template.csv',
    );
    res.download(filePath, 'template.csv', (err) => {
      if (err) {
        res.status(500).send('Could not download the file.');
      }
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id') id: string,
    @Body() payload: UpdateTransactionStatusSchema,
  ) {
    return this.transactionsService.update(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
  @Get(':id/transaction-detail')
  @UseGuards(AuthGuard)
  transactionDetail(
    @Param('id') id: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 5) || 5;
    return this.transactionsService.allTransactionDetail(
      id,
      pageNumber,
      limitNumber,
    );
  }
}
