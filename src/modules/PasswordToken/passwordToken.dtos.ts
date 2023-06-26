import { PasswordToken } from './passwordToken.entity';

export class CreatePasswordTokenInput {
  accountId: string;
  token: string;
  expireAt: Date;
}

export type CreatePasswordTokenOutput = PasswordToken;
