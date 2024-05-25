import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { DuplicateError } from 'src/error/duplicate';
import { Users } from 'src/model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const user = this.extractTokenFromHeader(request);

    const isExist = this.userRepository.exists({
      where: {
        id: user.id,
      },
    });

    if (!isExist) {
      throw new DuplicateError(401, 'invalid user');
    }

    request['sessionUser'] = user;
    return true;
  }

  private extractTokenFromHeader(request: Request): { [key: string]: string } {
    try {
      const authorization = request.headers['authorization'] as string;

      if (!authorization) {
        throw new DuplicateError(401, 'token must be provided');
      }

      const [type, token] = authorization.split(' ');

      if (type !== 'Bearer') throw new DuplicateError(401, 'must have bearer');
      const user = this.jwtService.verify(token);

      return user;
    } catch (error) {
      throw new DuplicateError(401, error.message);
    }
  }
}
