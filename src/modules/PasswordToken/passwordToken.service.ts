import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import * as bcrypt from 'bcrypt';
import {
  CreatePasswordCodeOutput,
  CreatePasswordTokenInput,
  VerifyCodeInput,
} from './passwordToken.dtos';
import { PasswordTokenRepository } from './passwordToken.repository';

@Injectable()
export class PasswordTokenService {
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
  ): Promise<CreatePasswordCodeOutput> {
    const tokenExist = await this.repository.findByAccountId(
      createPasswordTokenInput.accountId
    );

    if (tokenExist) {
      await this.repository.deleteToken(createPasswordTokenInput.accountId);
    }

    const code = this.generateCode();
    const hashedToken = await bcrypt.hash(
      code,
      Number(process.env.SALT_ROUNDS)
    );
    await this.repository.create({
      ...createPasswordTokenInput,
      token: hashedToken,
    });
    return { code: code };
  }

  async verifyToken(verifyCodeInput: VerifyCodeInput) {
    const token = await this.repository.findByAccountId(
      verifyCodeInput.accountId
    );
    const isEqual = await bcrypt.compare(verifyCodeInput.code, token.token);

    return isEqual;
  }

  async deleteToken(accountId: string) {
    return await this.repository.deleteToken(accountId);
  }
}
