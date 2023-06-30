import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import * as crypto from 'crypto';
import { AccountRepository } from './account.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  createAccountInput,
  resetPasswordInput,
} from './tests/stubs/account.stubs';
import * as bcrypt from 'bcrypt';
import { AccountNotFoundError, InvalidCodeError } from './account.errors';

import { PasswordTokenService } from '../PasswordToken/passwordToken.service';
import { faker } from '@faker-js/faker';
import { MailingService } from '../Mailing/mailing.service';
import { SendEmailError } from '../Mailing/mailing.errors';

describe('AccountService Unit Tests', () => {
  let service: AccountService;

  const salt = process.env.SALT_DATA;
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const resetPasswordTemplatePath = 'resetPassword.handlebars';

  jest.mock('bcrypt', () => ({
    hash: jest.fn(),
  }));

  jest.mock('../../utils/hashes', () => ({
    hashDataAsync: jest.fn().mockResolvedValue('hashed_email'),
  }));

  const createHashMock = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'hashed_email'),
  } as unknown as jest.Mocked<crypto.Hash>;

  const accountRepositoryMock = {
    alreadyExists: jest.fn().mockResolvedValue(true),
    createAccount: jest.fn(),
    findAccountByEmail: jest.fn(),
    changePassword: jest.fn(),
  };

  const tokenServiceMock = {
    create: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mailingServiceMock = {
    sendEmail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        PrismaService,
        { provide: AccountRepository, useValue: accountRepositoryMock },
        { provide: PasswordTokenService, useValue: tokenServiceMock },
        { provide: MailingService, useValue: mailingServiceMock },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When creating a new account', () => {
    it('should hash email field from input', async () => {
      jest
        .spyOn(accountRepositoryMock, 'alreadyExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);

      await service.createAccount(createAccountInput);

      expect(createHashMock.update).toHaveBeenCalledWith(
        createAccountInput.email + salt
      );
      expect(createHashMock.digest).toHaveReturnedWith('hashed_email');
    });

    it('verify if user already exists by using his hashed email', async () => {
      jest
        .spyOn(accountRepositoryMock, 'alreadyExists')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);
      const accountRepositorySpy = jest.spyOn(
        accountRepositoryMock,
        'alreadyExists'
      );

      await service.createAccount(createAccountInput);

      expect(accountRepositorySpy).toHaveBeenCalledWith('hashed_email');
    });

    it('it throws if user already exists', async () => {
      jest
        .spyOn(accountRepositoryMock, 'alreadyExists')
        .mockImplementation(() => {
          throw new UnprocessableEntityException('This e-mail already exists');
        });

      const promise = service.createAccount(createAccountInput);

      await expect(promise).rejects.toThrow(
        new UnprocessableEntityException('This e-mail already exists')
      );
    });

    it('it hashes user password before calling repository', async () => {
      jest
        .spyOn(accountRepositoryMock, 'alreadyExists')
        .mockResolvedValue(false);
      const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return new Promise((resolve) => resolve('hashed_password'));
      });

      await service.createAccount(createAccountInput);

      expect(hashSpy).toHaveBeenCalledWith(
        createAccountInput.password,
        saltRounds
      );
    });

    it('it should create a new account with correct data', async () => {
      // hashing password
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return new Promise((resolve) => resolve('hashed_password'));
      });
      // hashing email
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);
      const accountRepositorySpy = jest.spyOn(
        accountRepositoryMock,
        'createAccount'
      );

      await service.createAccount(createAccountInput);

      expect(accountRepositorySpy).toHaveBeenCalledWith({
        email: 'hashed_email',
        password: 'hashed_password',
        name: createAccountInput.name,
      });
    });
  });

  describe('When reseting user password', () => {
    const accountStub = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.person.firstName(),
    };

    accountRepositoryMock.findAccountByEmail.mockResolvedValue(accountStub);
    const repositorySpy = jest.spyOn(accountRepositoryMock, 'alreadyExists');
    const tokenServiceSpy = jest
      .spyOn(tokenServiceMock, 'create')
      .mockResolvedValue({ code: '123789' });

    it('should hash input email', async () => {
      jest
        .spyOn(accountRepositoryMock, 'alreadyExists')
        .mockResolvedValueOnce(true);
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);

      await service.resetPassword(accountStub);

      expect(createHashMock.update).toHaveBeenCalledWith(
        accountStub.email + salt
      );
      expect(createHashMock.digest).toHaveReturnedWith('hashed_email');
    });

    it('should verify if user exists with email', async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(true);
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);

      await service.resetPassword(resetPasswordInput);

      expect(repositorySpy).toHaveBeenCalledWith('hashed_email');
    });

    it.todo('should verify if user exists with telephone');

    it("should throw error if account doesn't exists", async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(false);

      const promise = service.resetPassword(resetPasswordInput);

      await expect(promise).rejects.toThrow(new AccountNotFoundError());
    });

    it('should call AccountRepository.find with correct params', async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(true);
      const repositorySpy = jest.spyOn(
        accountRepositoryMock,
        'findAccountByEmail'
      );
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);

      await service.resetPassword(resetPasswordInput);

      expect(repositorySpy).toHaveBeenCalledWith('hashed_email');
    });

    it('should call PasswordTokenService.create with correct params', async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(true);
      jest.spyOn(mailingServiceMock, 'sendEmail').mockResolvedValue(true);

      await service.resetPassword(resetPasswordInput);

      expect(tokenServiceSpy).toHaveBeenCalledWith({
        accountId: accountStub.id,
      });
    });

    it('should call MailingService.sendEmail with correct params', async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(true);

      const mailingServiceSpy = jest.spyOn(mailingServiceMock, 'sendEmail');

      await service.resetPassword(resetPasswordInput);

      expect(mailingServiceSpy).toHaveBeenCalledWith({
        from: process.env.FROM_EMAIL,
        to: resetPasswordInput.email,
        subject: 'Reset Password - Routinely',
        payload: { code: '123789', name: accountStub.name },
        template: resetPasswordTemplatePath,
      });
    });

    it('should throw error if MailingService.sendEmail throws', async () => {
      accountRepositoryMock.alreadyExists.mockResolvedValue(true);
      jest.spyOn(mailingServiceMock, 'sendEmail').mockImplementation(() => {
        throw new SendEmailError();
      });

      const promise = service.resetPassword(resetPasswordInput);

      await expect(promise).rejects.toThrow(new SendEmailError());
    });

    it.todo('check if user already has token');
  });

  describe('When changing user password', () => {
    const changePasswordInput = {
      code: '123789',
      password: 'new_password',
      repeatPassword: 'new_password',
      accountId: faker.string.uuid(),
    };
    jest.spyOn(tokenServiceMock, 'verifyToken').mockResolvedValue(true);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password' as never);
    it('calls bcryt.hash with input password', async () => {
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');

      await service.changePassword(changePasswordInput);

      expect(bcryptSpy).toHaveBeenCalledWith(
        changePasswordInput.password,
        saltRounds
      );
    });

    it('calls PasswordTokenService.verify with input code', async () => {
      const tokenServiceSpy = jest.spyOn(tokenServiceMock, 'verifyToken');

      await service.changePassword(changePasswordInput);

      expect(tokenServiceSpy).toHaveBeenCalledWith({
        code: changePasswordInput.code,
      });
    });

    it('throws error if PasswordTokenService.verify returns false', async () => {
      jest.spyOn(tokenServiceMock, 'verifyToken').mockResolvedValue(false);

      const promise = service.changePassword(changePasswordInput);

      await expect(promise).rejects.toThrow(new InvalidCodeError());
    });

    it('calls AccountRepository.changePassword with correct data', async () => {
      const accountRepositorySpy = jest.spyOn(
        accountRepositoryMock,
        'changePassword'
      );
      jest.spyOn(tokenServiceMock, 'verifyToken').mockResolvedValue(true);

      await service.changePassword(changePasswordInput);

      expect(accountRepositorySpy).toHaveBeenCalledWith({
        password: 'hashed_password',
        accountId: changePasswordInput.accountId,
      });
    });
  });
});
