import { Injectable } from '@nestjs/common/';
import { compare, hash } from 'bcrypt';
import * as crypto from 'crypto';
import {
  AuthorizationError,
  DataValidationError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from 'src/config/exceptions';
import { RoleLevel } from 'src/guards';
import { hashDataAsync } from 'src/utils/hashes';
import { MailingService } from '../Mailing/mailing.service';
import { VerifyCodeInput } from '../PasswordToken/passwordToken.dtos';
import { PasswordTokenService } from '../PasswordToken/passwordToken.service';
import {
  AccessAccountControllerInput,
  AccessAccountServiceOutput,
  ChangePasswordInput,
  CreateAccountControllerInput,
  CreateAccountServiceOutput,
  ResetPasswordInput,
  ResetPasswordOutput,
} from './account.dtos';
import { AccountRepository } from './account.repository';

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
  private encrypt(text: string) {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      process.env.SECRET_KEY_CRYPTO,
      process.env.IV
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  private decrypt(text: string) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      process.env.SECRET_KEY_CRYPTO,
      process.env.IV
    );
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  async createAccount(
    createAccountInput: CreateAccountControllerInput,
    callBackUrl: string
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
    await this.accountRepository.createAccount({
      email: hashedEmail,
      password: hashedPassword,
      permissions: RoleLevel.Standard,
      name: createAccountInput.name,
    });

    const queryUrlTemplate = this.encrypt(
      `email=${createAccountInput.email}&callBackUrl=${callBackUrl}`
    );
    const templateUrl = `${process.env.URL_API}/auth/confirmemail?${queryUrlTemplate}`;

    this.mailingService.sendEmail({
      from: process.env.FROM_EMAIL,
      to: createAccountInput.email,
      subject: 'Bem vindo ao Routinely',
      payload: { url: templateUrl },
      template: 'registerUser.handlebars',
    });

    return {
      message: 'Conta criada!',
    };

    // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_SERVICE::CREATE_ACCOUNT' });
  }

  async validateCode(verifyCodeInput: VerifyCodeInput) {
    const result = await this.tokenService.verifyToken(verifyCodeInput);
    if (!result) {
      throw new NotFoundError({
        message: 'Código inválido! - Tente novamente com um código diferente',
      });
    }

    return result;
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
      throw new NotFoundError({
        message: 'E-mail não cadastrado. Verifique o e-mail digitado.',
      });
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
    const { accountId, password, code } = changePasswordInput;

    const hashedPassword = await this.hashPassword(password);

    const isValid = await this.tokenService.verifyToken({
      code,
      accountId,
    });

    if (!isValid) {
      throw new AuthorizationError({
        message:
          'O código de verificação que você inseriu não é válido. Verifique o código e tente novamente.',
      });
    }

    await this.accountRepository.changePassword({
      password: hashedPassword,
      accountId,
    });

    await this.tokenService.deleteToken(accountId);
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

    if (!credentialFromDatabase.verifiedAt) {
      throw new AuthorizationError({
        message: 'E-mail não verificado. Verifique o e-mail e tente novamente.',
      });
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

  async confirmEmail(query: string): Promise<{ callBackUrl: string }> {
    const queryString = this.decrypt(Object.keys(query)[0]);

    const params = new URLSearchParams(queryString);

    const queryObject = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });

    const hashedEmail = await hashDataAsync(
      queryObject['email'],
      process.env.SALT_DATA
    );
    const user = await this.accountRepository.findAccountByEmail(hashedEmail);

    if (!user) {
      throw new NotFoundError({ message: 'E-mail não encontrado.' });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, ...restUser } = user;
    await this.accountRepository.updateAccount({
      ...restUser,
      verifiedAt: new Date(),
    });
    return { callBackUrl: queryObject['callBackUrl'] };
  }
}
