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

  const tokenStub = {
    id: 1,
    token: 'hashed_code',
  };

  jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
  }));

  const randomBytesMock = {
    randomBytes: jest.fn().mockReturnThis,
    readUIntBE: jest.fn().mockReturnValue(123),
  } as unknown as jest.Mocked<void>;

  const passwordTokenRepositoryMock = {
    create: jest.fn(),
    findByAccountId: jest.fn(),
    findByToken: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When creating a new password token', () => {
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

  describe('#verifyToken', () => {
    const verifyCodeInput = {
      code: '123789',
      accountId: faker.string.uuid(),
    };

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
      return new Promise((resolve) => resolve('hashed_code'));
    });
    jest
      .spyOn(passwordTokenRepositoryMock, 'findByToken')
      .mockResolvedValue(tokenStub);

    it('calls repository.findByAccountId with correct params', async () => {
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
        return new Promise((resolve) => resolve('hashed_code'));
      });
      const repositorySpy = jest.spyOn(
        passwordTokenRepositoryMock,
        'findByAccountId'
      );

      await service.verifyToken(verifyCodeInput);

      expect(repositorySpy).toHaveBeenCalledWith(verifyCodeInput.accountId);
    });

    it('calls bcrypt.compare with correct params', async () => {
      const bcryptSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockResolvedValue(true as never);
      jest
        .spyOn(passwordTokenRepositoryMock, 'findByToken')
        .mockResolvedValue(tokenStub);

      await service.verifyToken(verifyCodeInput);

      expect(bcryptSpy).toHaveBeenCalledWith(
        verifyCodeInput.code,
        tokenStub.token
      );
    });

    it('returns correct response if bcrypt.compare returns true', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest
        .spyOn(passwordTokenRepositoryMock, 'findByToken')
        .mockResolvedValue(tokenStub);

      const response = await service.verifyToken(verifyCodeInput);

      expect(response).toBe(true);
    });

    it('returns correct response if bcrypt.compare returns false', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      jest
        .spyOn(passwordTokenRepositoryMock, 'findByToken')
        .mockResolvedValue(tokenStub);

      const response = await service.verifyToken(verifyCodeInput);

      expect(response).toBe(false);
    });
  });
});
