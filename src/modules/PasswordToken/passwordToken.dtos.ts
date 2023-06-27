import { PasswordToken } from './passwordToken.entity';

export class CreatePasswordTokenInput {
  accountId: string;
  token: string;
}

export type CreatePasswordTokenOutput = PasswordToken;
