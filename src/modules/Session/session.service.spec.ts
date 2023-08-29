import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';

import { faker } from '@faker-js/faker';
import { CreateSessionServiceInput } from './session.dtos';
import { RoleLevel } from 'src/guards';

const createServiceInput: CreateSessionServiceInput = {
  accountId: faker.string.uuid(),
  name: faker.person.fullName(),
  permissions: RoleLevel.Standard,
  remember: faker.datatype.boolean(),
};

describe('SessionService unit test', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: {
            createSession: jest.fn().mockResolvedValue(true),
            findSessionByToken: jest.fn(),
            findExpiredSessionByToken: jest.fn(),
            updateSession: jest.fn(),
            excludeAllSessions: jest.fn(),
            excludeSession: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create session', () => {
    it('Happy path - should return a SessionServiceOutput', async () => {
      const actual = await service.createSession(createServiceInput);
      const { name, remember, permissions } = createServiceInput;
      const diff = remember ? 36e5 * 24 * 7 : 36e5;
      const expiresInExpected = new Date(new Date().getTime() + diff);
      const hexadecimalRegex = /^[a-f0-9]+$/;

      expect(actual.name).toEqual(name);
      expect(actual.token).toMatch(hexadecimalRegex);
      expect(actual.refreshToken).toMatch(hexadecimalRegex);
      expect(actual.permissions).toEqual(permissions);
      expect(actual.expiresIn.getTime()).toBeLessThanOrEqual(
        expiresInExpected.getTime()
      );
      expect(actual.expiresIn.getTime()).toBeGreaterThanOrEqual(
        expiresInExpected.getTime() - 10
      );
    });
  });
});
