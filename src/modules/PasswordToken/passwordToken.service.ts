import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { CreatePasswordTokenInput } from './passwordToken.dtos';
import { PasswordTokenRepository } from './passwordToken.repository';

@Injectable()
export class PasswordTokenService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private repository: PasswordTokenRepository) {}

  private generateCode(): string {
    let code = '';

    do {
      code += randomBytes(3).readUIntBE(0, 3);
    } while (code.length < 6);
    return code.slice(0, 6);
  }

  async create(
    createPasswordTokenInput: CreatePasswordTokenInput
  ): Promise<string> {
    const token = this.generateCode();
    const hashedToken = await bcrypt.hash(
      token,
      Number(process.env.SALT_ROUNDS)
    );
    await this.repository.create(createPasswordTokenInput);
    return hashedToken;
  }
}
