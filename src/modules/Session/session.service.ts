import { randomBytes } from 'node:crypto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import {
  CreateSessionServiceInput,
  CreateSessionServiceOutput,
} from './session.dtos';
import { hashDataAsync } from 'src/utils/hashes';

@Injectable()
export class SessionService {
  private expiresInAHour = 36e5;
  private expiresInAWeek = 36e5 * 24 * 7;

  constructor(private sessionRepository: SessionRepository) {}

  async createSession({
    accountId,
    permissions,
    name,
    remember,
  }: CreateSessionServiceInput): Promise<CreateSessionServiceOutput> {
    const randomSessionToken = randomBytes(20).toString('hex');
    const randomRefreshToken = randomBytes(20).toString('hex');

    const hashedRefreshToken = await hashDataAsync(
      randomRefreshToken,
      process.env.SALT_SESSION
    );

    if (!hashedRefreshToken) {
      throw new InternalServerErrorException('Error on try create session');
    }

    const sessionTokenExpiresIn = remember
      ? this.expiresInAWeek
      : this.expiresInAHour;
    const refreshTokenExpiresIn = sessionTokenExpiresIn * (remember ? 4 : 1.5); // 1 month : 1h 30min
    const now = new Date().getTime();

    const sessionConfig = {
      sessionToken: randomSessionToken,
      refreshToken: hashedRefreshToken,
      sessionExpiresIn: new Date(now + sessionTokenExpiresIn),
      refreshExpiresIn: new Date(now + refreshTokenExpiresIn),
      accountId,
      permissions,
      name,
    };

    const sessionSaved = await this.sessionRepository.createSession(
      sessionConfig
    );

    if (!sessionSaved) {
      throw new InternalServerErrorException();
    }

    // todo: create cache
    // const sessionDataToCache = {
    //   sessionToken: randomSessionToken,
    //   accountId,
    //   permissions,
    //   name,
    // };

    const sessionDataToResponse = {
      token: randomSessionToken,
      refreshToken: randomRefreshToken,
      permissions,
      name,
      expiresIn: sessionConfig.sessionExpiresIn,
    };

    return sessionDataToResponse;
  }
}
