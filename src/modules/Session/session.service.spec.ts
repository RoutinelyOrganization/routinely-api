import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';

import * as constants from 'src/utils/constants';
import * as stubs from './tests/session.stubs';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

describe('SessionService unit test', () => {
  let service: SessionService;

  const sessionRepositoryMock = {
    createSession: jest.fn().mockResolvedValue(true),
    findSessionByToken: jest.fn().mockResolvedValue(stubs.findByTokenOutput),
    findExpiredSessionByToken: jest
      .fn()
      .mockResolvedValue(stubs.findExpiredByTokenOutput),
    updateSession: jest.fn(),
    excludeAllSessions: jest.fn(),
    excludeSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: SessionRepository,
          useValue: sessionRepositoryMock,
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

    it('Unhappy path - should return a InternalServerError', async () => {
      jest
        .spyOn(sessionRepositoryMock, 'createSession')
        .mockResolvedValueOnce(false);

      try {
        await service.createSession(stubs.createInput);
      } catch (actual) {
        expect(actual).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('Find session by token', () => {
    it('Happy path - should return a FindSessionServiceOutput', async () => {
      const actual = await service.findSessionToken(
        stubs.findByTokenInput.token
      );

      expect(actual).toEqual(stubs.findByTokenOutput);
    });

    it(`Unhappy path - should return a error message: "${stubs.expectedMessages.sessionExpired}"`, async () => {
      jest
        .spyOn(sessionRepositoryMock, 'findSessionByToken')
        .mockResolvedValueOnce(false);

      try {
        await service.findSessionToken(stubs.findByTokenInput.token);
      } catch (actual) {
        expect(actual.message).toEqual(stubs.expectedMessages.sessionExpired);
        expect(actual).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('Find expired session by token and refresh token', () => {
    it('Happy path - should return a RefreshTokenServiceOutput', async () => {
      const { token, refreshToken } = stubs.findExpiredByTokenInput;
      const actual = await service.findExpiredSessionByTokenAndRefreshToken(
        token,
        refreshToken
      );

      expect(actual.expiresIn).toBeInstanceOf(Date);
      expect(actual.token).toMatch(constants.hexadecimalRegex);
      expect(actual.refreshToken).toMatch(constants.hexadecimalRegex);

      expect(actual.token).not.toEqual(token);
      expect(actual.refreshToken).not.toEqual(refreshToken);
    });

    it(`Unhappy path - should return a error message: "${stubs.expectedMessages.expiredOrDeleted}"`, async () => {
      jest
        .spyOn(sessionRepositoryMock, 'findExpiredSessionByToken')
        .mockResolvedValueOnce(null);

      try {
        await service.findExpiredSessionByTokenAndRefreshToken('', '');
      } catch (actual) {
        expect(actual.message).toEqual(stubs.expectedMessages.expiredOrDeleted);
        expect(actual).toBeInstanceOf(UnauthorizedException);
      }
    });

    it(`Unhappy path - should return a error message: "${stubs.expectedMessages.invalidCredentials}"`, async () => {
      try {
        await service.findExpiredSessionByTokenAndRefreshToken(
          stubs.findExpiredByTokenInput.token,
          'invalidtoken'
        );
      } catch (actual) {
        expect(actual.message).toEqual(
          stubs.expectedMessages.invalidCredentials
        );
        expect(actual).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
