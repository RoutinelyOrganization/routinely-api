import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordTokenService } from './passwordToken.service';
import { PasswordTokenRepository } from './passwordToken.repository';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import {
  createTokenInput,
  createTokenOutput,
} from './tests/passwordToken.stubs';
import { faker } from '@faker-js/faker';

describe('PasswordToken Unit Tests', () => {
  let service: PasswordTokenService;
  const saltRounds = Number(process.env.SALT_ROUNDS);

  jest.mock('bcrypt', () => ({
    hash: jest.fn(),
  }));

  const randomBytesMock = {
    randomBytes: jest.fn().mockReturnThis,
    readUIntBE: jest.fn().mockReturnValue(123),
  } as unknown as jest.Mocked<void>;

  const passwordTokenRepositoryMock = {
    create: jest.fn(),
    findByAccountId: jest.fn(),
    deleteToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordTokenService,
        PrismaService,
        {
          provide: PasswordTokenRepository,
          useValue: passwordTokenRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PasswordTokenService>(PasswordTokenService);
  });

  describe('When creating a new password token', () => {
    const tokenStub = {
      id: 1,
      token: 'hashed_code',
      expireAt: faker.date.soon({ days: 2 }),
    };
    it('should generate token with correct params ', async () => {
      const randomBytesSpy = jest
        .spyOn(crypto, 'randomBytes')
        .mockReturnValue(randomBytesMock);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return new Promise((resolve) => resolve('hashed_token'));
      });

      await service.create(createTokenInput);

      expect(randomBytesSpy).toHaveBeenCalledTimes(2);
      expect(randomBytesSpy).toHaveBeenCalledWith(3);
    });

    it('should check if account already has token', async () => {
      const repositorySpy = jest
        .spyOn(passwordTokenRepositoryMock, 'findByAccountId')
        .mockResolvedValue(tokenStub);

      await service.create(createTokenInput);

      expect(repositorySpy).toHaveBeenCalledWith(createTokenInput.accountId);
    });

    it('should delete token if account already has one and is expired', async () => {
      jest
        .spyOn(passwordTokenRepositoryMock, 'findByAccountId')
        .mockResolvedValue(tokenStub);
      const repositorySpy = jest.spyOn(
        passwordTokenRepositoryMock,
        'deleteToken'
      );

      await service.create(createTokenInput);

      expect(repositorySpy).toHaveBeenCalledWith(createTokenInput.accountId);
    });

    it('should hash token after being generated', async () => {
      const bcryptSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return new Promise((resolve) => resolve('hashed_token'));
      });

      await service.create(createTokenInput);

      expect(bcryptSpy).toHaveBeenCalledWith('123123', saltRounds);
    });

    it('should call repository .create with correct params', async () => {
      const repositorySpy = jest.spyOn(passwordTokenRepositoryMock, 'create');

      await service.create(createTokenInput);

      expect(repositorySpy).toHaveBeenCalledWith({
        ...createTokenInput,
        token: 'hashed_token',
      });
    });

    it('should return correct response', async () => {
      jest
        .spyOn(passwordTokenRepositoryMock, 'create')
        .mockResolvedValue({ ...createTokenOutput });

      const response = await service.create(createTokenInput);

      expect(response).toEqual({ code: '123123' });
    });
  });
});
