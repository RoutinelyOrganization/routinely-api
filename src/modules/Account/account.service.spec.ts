import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { CreateAccountDto } from './account.dtos';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';
import { AccountRepository } from './account.repository';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AccountService Unit Tests', () => {
  let service: AccountService;

  const salt = process.env.SALT_DATA;

  const createHashMock = {
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'hashed_data'),
  } as unknown as jest.Mocked<crypto.Hash>;

  // Mocking AccountRepository
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
      const createAccountInput: CreateAccountDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        acceptedTerms: true,
        password: faker.internet.password(),
      };
      jest
        .spyOn(crypto, 'createHash')
        .mockImplementationOnce(() => createHashMock);

      await service.createAccount(createAccountInput);

      expect(createHashMock.update).toHaveBeenCalledWith(
        createAccountInput.email + salt
      );
      expect(createHashMock.digest).toHaveReturnedWith('hashed_data');
    });

    it('verify if user already exists by using his hashed email', async () => {
      const createAccountInput: CreateAccountDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        acceptedTerms: true,
        password: faker.internet.password(),
      };
      const accountRepositorySpy = jest.spyOn(
        accountRepositoryMock,
        'alreadyExists'
      );

      await service.createAccount(createAccountInput);

      expect(accountRepositorySpy).toHaveBeenCalledWith('hashed_data');
    });
  });
});
