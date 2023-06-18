import { createHash } from 'node:crypto';
import { hash, compare } from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common/';
import type {
  ICreateAccountExpect,
  ICreateAccountResponse,
} from 'src/types/account';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

  private hashData(unhashedData: string): string {
    return createHash(process.env.HASH_ALGORITHM)
      .update(unhashedData)
      .digest('hex');
  }

  private async hashPassword(pass: string): Promise<string> {
    return await hash(pass, Number(process.env.SALT_ROUNDS));
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async createAccount(
    data: ICreateAccountExpect
  ): Promise<ICreateAccountResponse> {
    if (data.acceptedTerms !== true) {
      throw new BadRequestException('Please accept our privacy policies');
    }

    const hashedEmail = this.hashData(data.email);
    const alreadyExists = await this.accountRepository.alreadyExists(
      hashedEmail
    );

    if (alreadyExists) {
      throw new UnprocessableEntityException('This e-mail already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);
    const created = await this.accountRepository.createAccount({
      email: hashedEmail,
      password: hashedPassword,
      name: data.name,
    });

    if (created) {
      return {
        message: 'Account created!',
      };
    }

    // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_SERVICE::CREATE_ACCOUNT' });
    throw new InternalServerErrorException();
  }
}
