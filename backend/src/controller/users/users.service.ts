import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionUser, Users } from 'src/model';
import { Credentials } from 'src/model/credential.entity';
import {
  LoginSchema,
  RegisterRequestSchema,
  SubmitSchema,
} from 'src/schema/users.schema';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcrypt';
import { DuplicateError } from '../../error/duplicate';
import { UserStatus } from 'src/const/enum';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Credentials)
    private credentialRepository: Repository<Credentials>,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private jwtService: JwtService,
  ) {}
  async validate(payload: RegisterRequestSchema): Promise<Users> {
    try {
      const otp = randomInt(0, 1000000).toString().padStart(6, '0');

      const user = await this.userRepository.findOne({
        where: {
          email: payload.email,
        },
      });

      if (user) {
        this.client.emit('register.email', { email: user.email, otp });
        const credential = await this.credentialRepository.findOne({
          where: {
            userId: user.id,
          },
        });
        credential.firstVerificationOTP = otp;
        await this.credentialRepository.save(credential);
        return user;
      }

      const data = await this.userRepository
        .save(payload)
        .then(async (user) => {
          await this.credentialRepository.save({
            userId: user.id,
            firstVerificationOTP: otp,
          });

          // send otp
          this.client.emit('email', { email: user.email, otp });
          return user;
        });

      return data;
    } catch (error) {
      throw error;
    }
  }

  async submit(payload: SubmitSchema) {
    const user = await this.userRepository.findOne({
      relations: ['credentials'],
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new DuplicateError(404, 'User Not found');
    }

    if (user.credentials.firstVerificationOTP !== payload.verificationOTP) {
      throw new DuplicateError(400, 'Wrong OTP');
    }

    user.status = UserStatus.ACTIVE;
    user.corporateAccountNo = payload.corporateAccountNo;
    user.corporateName = payload.corporateName;
    user.phoneNo = payload.phoneNo;
    user.userId = payload.userId;
    user.userName = payload.userName;
    user.role = payload.role;

    const credential = await this.credentialRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    credential.password = await bcrypt.hashSync(payload.password, 10);

    await this.credentialRepository.save(credential);

    await this.userRepository.save(user);
  }

  async login(payload: LoginSchema) {
    const user = await this.userRepository.findOne({
      relations: ['credentials'],
      where: {
        userId: payload.userId,
        corporateAccountNo: payload.corporateAccountNo,
        status: UserStatus.ACTIVE,
      },
    });

    if (!user) throw new DuplicateError(401, 'User not found');

    const isAuthorized = bcrypt.compare(
      payload.password,
      user.credentials.password,
    );

    if (!isAuthorized) throw new DuplicateError(401, 'Wrong Passord');

    const jwtClaim = {
      id: user.id,
      userName: user.userName,
      role: user.role,
      corporateName: user.corporateName,
      corporateAccountNo: user.corporateAccountNo,
      loginTime: dayjs().format('DD MM, YYYY hh:mm:ss'),
    };

    return {
      access_token: await this.jwtService.signAsync(jwtClaim),
      type: 'Bearer',
      expired_at: new Date(),
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async me(user: SessionUser) {
    const data = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    return { ...user, ...data };
  }
}
