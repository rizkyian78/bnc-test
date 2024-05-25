import { IsEmail, IsNotEmpty } from 'class-validator';
import { Roles } from 'src/const/enum';

export class RegisterRequestSchema {
  @IsEmail()
  email: string;
}

export class SubmitSchema {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  verificationOTP: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  corporateAccountNo: string;

  @IsNotEmpty()
  corporateName: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  role: Roles;

  @IsNotEmpty()
  phoneNo: string;
}

export class LoginSchema {
  @IsNotEmpty()
  corporateAccountNo: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;
}
