import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsEmail,
  IsStrongPassword,
  IsBoolean,
  IsHexadecimal,
} from 'class-validator';
import { IsEqualTo } from 'src/utils/decorators/isEqualTo';

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
  'permissions',
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

// Disconnect
export class DisconnectAccountControllerInput {
  @IsBoolean()
  @ApiProperty()
  closeAllSessions: boolean;
}

// Refresh
export class RefreshSessionControllerInput {
  @IsNotEmpty()
  @IsHexadecimal()
  @ApiProperty()
  refreshToken: string;
}

// password
export class ResetPasswordInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordOutput {
  accountId: string;
}

export class ChangePasswordInput {
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsEqualTo('password')
  repeatPassword: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  accountId: string;
}

export class ChangePasswordRepositoryInput {
  password: string;
  accountId: string;
}
