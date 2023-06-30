import { hash, compare } from 'bcrypt';
import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common/';
import {
  AccessAccountControllerInput,
  CreateAccountServiceOutput,
  AccessAccountServiceOutput,
  CreateAccountControllerInput,
  ChangePasswordInput,
} from './account.dtos';
import { AccountRepository } from './account.repository';
import { ResetPasswordInput } from './account.dtos';
import { AccountNotFoundError, InvalidCodeError } from './account.errors';
import { hashDataAsync } from 'src/utils/hashes';
import { PasswordTokenService } from '../PasswordToken/passwordToken.service';
import { MailingService } from '../Mailing/mailing.service';
import { SendEmailError } from '../Mailing/mailing.errors';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private tokenService: PasswordTokenService,
    private mailingService: MailingService
  ) {}

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

  async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<void> {
    const hashedEmail = await hashDataAsync(
      resetPasswordInput.email,
      process.env.SALT_DATA
    );

    const accountExists = await this.accountRepository.alreadyExists(
      hashedEmail
    );
    if (!accountExists) throw new AccountNotFoundError();
    const account = await this.accountRepository.findAccountByEmail(
      hashedEmail
    );

    // todo: check if user code has expired
    const createdCode = await this.tokenService.create({
      accountId: account.id,
    });

    try {
      return await this.mailingService.sendEmail({
        from: process.env.FROM_EMAIL,
        to: resetPasswordInput.email,
        subject: 'Reset Password - Routinely',
        payload: { name: account.name, code: createdCode.code },
        template: 'resetPassword.handlebars',
      });
    } catch (e) {
      console.log(e, 'account service');
      throw new SendEmailError();
    }
  }

  async changePassword(
    changePasswordInput: ChangePasswordInput
  ): Promise<void> {
    const isValid = await this.tokenService.verifyToken({
      code: changePasswordInput.code,
      accountId: changePasswordInput.accountId,
    });
    if (isValid) {
      const hashedPassword = await this.hashPassword(
        changePasswordInput.password
      );
      await this.accountRepository.changePassword({
        password: hashedPassword,
        accountId: changePasswordInput.accountId,
      });
      // TODO: delete token after changes password
    } else throw new InvalidCodeError();
    return;
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
