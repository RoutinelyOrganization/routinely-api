import { hash, compare } from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common/';
import {
  AccessAccountControllerInput,
  CreateAccountControllerInput,
  CreateAccountServiceOutput,
  AccessAccountServiceOutput,
} from './account.dtos';
import { AccountRepository } from './account.repository';
import { hashDataAsync } from 'src/utils/hashes';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}

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
    createAccountInput: CreateAccountControllerInput
  ): Promise<CreateAccountServiceOutput> {
    if (createAccountInput.acceptedTerms !== true) {
      throw new BadRequestException('Please accept our privacy policies');
    }

    const hashedEmail = await hashDataAsync(
      createAccountInput.email,
      process.env.SALT_DATA
    );

    if (!hashedEmail) {
      throw new UnprocessableEntityException('Unknown error');
    }

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

  async accessAccount(
    accountInput: AccessAccountControllerInput
  ): Promise<AccessAccountServiceOutput> {
    const hashedEmail = await hashDataAsync(
      accountInput.email,
      process.env.SALT_DATA
    );
    const credentialFromDatabase =
      await this.accountRepository.findAccountByEmail(hashedEmail);

    if (!credentialFromDatabase) {
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    }

    const validatePass = await this.comparePassword(
      accountInput.password,
      credentialFromDatabase.password
    );

    if (!validatePass) {
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    }

    return {
      id: credentialFromDatabase.id,
      permissions: credentialFromDatabase.permissions,
      name: credentialFromDatabase.name,
    };
  }
}
