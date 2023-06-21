import { createHash } from 'node:crypto';
import { hash, compare } from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common/';
import type { ICreateAccountResponse } from 'src/types/account';
import { AccountRepository } from './account.repository';
import { CreateAccountDto } from './account.dtos';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  private hashData(unhashedData: string): string {
    return createHash('sha256')
      .update(unhashedData + process.env.SALT_DATA)
      .digest('hex');
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, Number(process.env.SALT_ROUNDS));
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async createAccount(
    createAccountInput: CreateAccountDto
  ): Promise<ICreateAccountResponse> {
    if (createAccountInput.acceptedTerms !== true) {
      throw new BadRequestException('Please accept our privacy policies');
    }

    const hashedEmail = this.hashData(createAccountInput.email);
    const alreadyExists = await this.accountRepository.alreadyExists(
      hashedEmail
    );

    if (alreadyExists) {
      throw new UnprocessableEntityException('This e-mail already exists');
    }

    const hashedPassword = await this.hashPassword(createAccountInput.password);
    const created = await this.accountRepository.createAccount({
      email: hashedEmail,
      password: hashedPassword,
      name: createAccountInput.name,
    });

    if (created) {
      return {
        message: 'Account created!',
      };
    }

    // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_SERVICE::CREATE_ACCOUNT' });
  }
}
