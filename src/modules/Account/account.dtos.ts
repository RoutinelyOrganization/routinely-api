import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsEmail,
  IsStrongPassword,
  IsBoolean,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-ZÀ-ÿ ]+$/)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  acceptedTerms: boolean;
}

export class ResetPasswordInput {
  email: string;
}
