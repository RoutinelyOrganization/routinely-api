import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsEmail,
  IsStrongPassword,
  IsBoolean,
} from 'class-validator';

class AccountBaseDto {
  id: string;
  email: string;
  password: string;
  permissions: string[];
  verifiedAt: Date | null;
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create
export class CreateAccountControllerInput {
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
  acceptedTerms?: boolean;
}

export class CreateAccountRepositoryInput extends PickType(AccountBaseDto, [
  'email',
  'password',
]) {
  name: string;
}

export class CreateAccountServiceOutput {
  message: string;
}

// Access
export class AccessAccountControllerInput extends PickType(
  CreateAccountControllerInput,
  ['email', 'password']
) {
  @IsBoolean()
  @ApiProperty()
  remember?: boolean;
}

export class AccessAccountRepositoryOutput extends PickType(AccountBaseDto, [
  'id',
  'email',
  'password',
  'permissions',
]) {
  name: string;
}

export class AccessAccountServiceOutput extends PickType(AccountBaseDto, [
  'id',
  'permissions',
]) {
  name: string;
}

export class ResetPasswordInput {
  email: string;
}

export class ChangePasswordInput {
  password: string;
  repeatPassword: string;
  code: string;
  accountId: string;
}

export class ChangePasswordData {
  password: string;
  accountId: string;
}
