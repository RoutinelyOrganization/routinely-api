import { hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common/';
import {
  AccessAccountControllerInput,
  CreateAccountServiceOutput,
  AccessAccountServiceOutput,
  CreateAccountControllerInput,
  ChangePasswordInput,
  ResetPasswordOutput,
  ResetPasswordInput,
} from './account.dtos';
import { AccountRepository } from './account.repository';
import { hashDataAsync } from 'src/utils/hashes';
import { RoleLevel } from 'src/guards';
import { PasswordTokenService } from '../PasswordToken/passwordToken.service';
import { MailingService } from '../Mailing/mailing.service';
import {
  AuthorizationError,
  DataValidationError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from 'src/config/exceptions';

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
      throw new DataValidationError({
        message: 'Por favor, aceite nossos termos de uso',
        property: 'acceptedTerms',
      });
    }

    const hashedEmail = await hashDataAsync(
      createAccountInput.email,
      process.env.SALT_DATA
    );

    if (!hashedEmail) {
      throw new UnprocessableEntityError({
        message: 'Erro desconhecido',
      });
    }

    const alreadyExists = await this.accountRepository.alreadyExists(
      hashedEmail
    );

    if (alreadyExists) {
      throw new UnprocessableEntityError({
        property: 'email',
        message: 'O e-mail já existe na base de dados',
      });
    }

    const hashedPassword = await this.hashPassword(createAccountInput.password);
    const created = await this.accountRepository.createAccount({
      email: hashedEmail,
      password: hashedPassword,
      permissions: RoleLevel.Standard,
      name: createAccountInput.name,
    });

    if (created) {
      return {
        message: 'Conta criada!',
      };
    }

    // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_SERVICE::CREATE_ACCOUNT' });
  }

  async resetPassword(
    resetPasswordInput: ResetPasswordInput
  ): Promise<ResetPasswordOutput> {
    const hashedEmail = await hashDataAsync(
      resetPasswordInput.email,
      process.env.SALT_DATA
    );

    const accountExists = await this.accountRepository.alreadyExists(
      hashedEmail
    );
    if (!accountExists)
      throw new NotFoundError({ message: 'Conta não encontrada' });
    const account = await this.accountRepository.findAccountByEmail(
      hashedEmail
    );

    const createdCode = await this.tokenService.create({
      accountId: account.id,
    });

    try {
      await this.mailingService.sendEmail({
        from: process.env.FROM_EMAIL,
        to: resetPasswordInput.email,
        subject: 'Alterar senha Routinely',
        payload: { name: account.name, code: createdCode.code },
        template: 'resetPassword.handlebars',
      });
      return { accountId: account.id };
    } catch (e) {
      throw new InternalServerError({});
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

      await this.tokenService.deleteToken(changePasswordInput.accountId);
    } else {
      throw new AuthorizationError({ message: 'Código inválido' });
    }
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
      throw new AuthorizationError({});
    }

    const validatePass = await this.comparePassword(
      accountInput.password,
      credentialFromDatabase.password
    );

    if (!validatePass) {
      throw new AuthorizationError({});
    }

    return {
      id: credentialFromDatabase.id,
      permissions: credentialFromDatabase.permissions,
      name: credentialFromDatabase.name,
    };
  }
}
