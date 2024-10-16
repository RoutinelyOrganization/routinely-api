import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { responses } from 'src/config/responses';

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

const nameRegex = /^[a-zA-ZÀ-ÿ ]+$/;

export class CreateAccountControllerInput {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  @Matches(nameRegex, { message: responses.fullname })
  name: string;

  @ApiProperty({ example: 'example@string.com' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  @IsEmail({}, { message: responses.email })
  email: string;

  @ApiProperty({ example: 'strW#3' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsStrongPassword({ minLength: 6 }, { message: responses.strongPassword })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @IsBoolean({ message: responses.boolean })
  acceptedTerms?: boolean;
}

export class CreateAccountRepositoryInput extends PickType(AccountBaseDto, [
  'email',
  'password',
  'permissions',
]) {
  name: string;
}

export class UpdateAccountRepositoryInput extends PartialType(AccountBaseDto) {
  id: string;
  verifiedAt: Date | null;
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
  'verifiedAt',
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
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordOutput {
  accountId: string;
}

export class ChangePasswordInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 6 })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  accountId: string;
}

export class ChangePasswordRepositoryInput {
  password: string;
  accountId: string;
}

export class ValidateTokenInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accountId: string;
}

export class QueryCallBackUrl {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  callBackUrl: string;
}
