import { randomBytes } from 'node:crypto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import {
  ICreateSessionServiceExpect,
  ICreateSessionServiceResponse,
} from 'src/types/session';
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
  }: ICreateSessionServiceExpect): Promise<ICreateSessionServiceResponse> {
    const randomSessionToken = randomBytes(20).toString('hex');
    const randomRefreshToken = randomBytes(20).toString('hex');

    const hashedSessionToken = await hashDataAsync(
      randomSessionToken,
      process.env.SALT_SESSION
    );

    const hashedRefreshToken = await hashDataAsync(
      randomRefreshToken,
      process.env.SALT_SESSION
    );

    if (!hashedSessionToken || !hashedRefreshToken) {
      throw new InternalServerErrorException('Error on try create session');
    }

    const sessionTokenExpiresIn = remember
      ? this.expiresInAWeek
      : this.expiresInAHour;
    const refreshTokenExpiresIn = sessionTokenExpiresIn * (remember ? 4 : 1.5); // 1 month : 1h 30min
    const now = new Date().getTime();

    const sessionConfig = {
      sessionToken: hashedSessionToken,
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
    //   hashedToken: hashedSessionToken,
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
