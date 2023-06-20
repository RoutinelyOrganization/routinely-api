import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import * as crypto from 'crypto';
import { AccountRepository } from './account.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { createAccountInput } from './tests/stubs/account.stubs';
import * as bcrypt from 'bcrypt';

describe('AccountService Unit Tests', () => {
  let service: AccountService;

  const salt = process.env.SALT_DATA;
  const saltRounds = Number(process.env.SALT_ROUNDS);

  jest.mock('bcrypt', () => ({
    hash: jest.fn(),
  }));

  const createHashMock = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'hashed_email'),
  } as unknown as jest.Mocked<crypto.Hash>;

  const accountRepositoryMock = {
    alreadyExists: jest.fn(),
    createAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        PrismaService,
        { provide: AccountRepository, useValue: accountRepositoryMock },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('When creating a new account', () => {
    it('should hash email field from input', async () => {
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
});
