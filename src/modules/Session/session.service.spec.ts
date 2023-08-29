import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';

import * as constants from 'src/utils/constants';
import * as stubs from './session.stubs.test';

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
      const actual = await service.createSession(stubs.createInput);
      const { name, remember, permissions } = stubs.createInput;
      const diff = remember
        ? constants.expirationWhenRememberIsOnn
        : constants.expirationWhenRememberIsOff;
      const expiresInExpected = new Date(new Date().getTime() + diff);
      const hexadecimalRegex = constants.hexadecimalRegex;

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
