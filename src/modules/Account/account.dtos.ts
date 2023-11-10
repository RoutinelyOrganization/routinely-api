import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Matches,
  IsEmail,
  IsStrongPassword,
  IsBoolean,
  IsHexadecimal,
  IsString,
} from 'class-validator';
import { IsEqualTo } from 'src/utils/decorators/isEqualTo';
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
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  @IsEqualTo('password')
  repeatPassword: string;

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
