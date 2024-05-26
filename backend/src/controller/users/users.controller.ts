import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  LoginSchema,
  RegisterRequestSchema,
  SubmitSchema,
} from 'src/schema/users.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('submit')
  submit(@Body() createUserDto: SubmitSchema) {
    return this.usersService.submit(createUserDto);
  }

  @Post('validate')
  register(@Body() payload: RegisterRequestSchema) {
    return this.usersService.validate(payload);
  }

  @Post('login')
  login(@Body() payload: LoginSchema) {
    return this.usersService.login(payload);
  }
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: Request) {
    return this.usersService.me(request['sessionUser']);
    // return this.usersService.findAll();
  }
}
