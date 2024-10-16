import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { AuthorizationError, InternalServerError } from 'src/config/exceptions';
import {
  expirationWhenRememberIsOff,
  expirationWhenRememberIsOnn,
} from 'src/utils/constants';
import { hashDataAsync } from 'src/utils/hashes';
import {
  CreateSessionServiceInput,
  CreateSessionServiceOutput,
  ExcludeSessionsServiceInput,
  FindSessionServiceOutput,
  RefreshTokenServiceOutput,
} from './session.dtos';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(private sessionRepository: SessionRepository) {}

  private randomToken = async (
    hasheToken = false,
    bytes = 20
  ): Promise<{ original: string; hashed: string }> => {
    const token = randomBytes(bytes).toString('hex');
    let hashedToken: string;

    if (hasheToken) {
      hashedToken = await hashDataAsync(token, process.env.SALT_SESSION);

      if (!hashedToken) {
        throw new InternalServerError({
          message: 'Erro ao tentar criar a sessão',
        });
      }
    }

    return {
      original: token,
      hashed: hashedToken || undefined,
    };
  };

  private calcTokensExpirationDate = (remember = false) => {
    const sessionTokenExpiresIn = remember
      ? expirationWhenRememberIsOnn
      : expirationWhenRememberIsOff;
    const refreshTokenExpiresIn = sessionTokenExpiresIn * (remember ? 4 : 2);
    const now = new Date().getTime();

    return {
      sessionExpiresIn: new Date(now + sessionTokenExpiresIn),
      refreshExpiresIn: new Date(now + refreshTokenExpiresIn),
    };
  };

  async createSession({
    accountId,
    permissions,
    name,
    remember,
  }: CreateSessionServiceInput): Promise<CreateSessionServiceOutput> {
    const randomSessionToken = await this.randomToken();
    const randomRefreshToken = await this.randomToken(true);

    const { sessionExpiresIn, refreshExpiresIn } =
      this.calcTokensExpirationDate(remember);

    const sessionConfig = {
      sessionToken: randomSessionToken.original,
      refreshToken: randomRefreshToken.hashed,
      sessionExpiresIn,
      refreshExpiresIn,
      accountId,
      permissions,
      name,
      remember,
    };

    const sessionSaved = await this.sessionRepository.createSession(
      sessionConfig
    );

    if (!sessionSaved) {
      throw new InternalServerError({});
    }

    return {
      token: randomSessionToken.original,
      refreshToken: randomRefreshToken.original,
      expiresIn: sessionConfig.sessionExpiresIn,
      permissions,
      name,
    };
  }

  async findSessionToken(
    token: string
  ): Promise<FindSessionServiceOutput | null> {
    const sessionOutput = await this.sessionRepository.findSessionByToken({
      sessionToken: token,
    });

    if (!sessionOutput) {
      throw new AuthorizationError({
        message: 'Sessão expirada',
      });
    }

    return sessionOutput;
  }

  async findExpiredSessionByTokenAndRefreshToken(
    token: string,
    refreshToken: string
  ): Promise<RefreshTokenServiceOutput> {
    const expiredSession =
      await this.sessionRepository.findExpiredSessionByToken({
        sessionToken: token,
      });

    if (!expiredSession) {
      throw new AuthorizationError({
        message: 'Essa sessão está expirada ou foi finalizada',
      });
    }

    const hashedRefreshToken = await hashDataAsync(
      refreshToken,
      process.env.SALT_SESSION
    );

    if (!hashedRefreshToken) {
      throw new InternalServerError({
        message: 'Erro ao tentar verificar a sessão',
      });
    }

    if (hashedRefreshToken !== expiredSession.refreshToken) {
      throw new AuthorizationError({});
    }

    const randomSessionToken = await this.randomToken();
    const randomRefreshToken = await this.randomToken(true);

    const { sessionExpiresIn, refreshExpiresIn } =
      this.calcTokensExpirationDate(expiredSession.remember);

    const newSessionConfig = {
      id: expiredSession.id,
      sessionToken: randomSessionToken.original,
      refreshToken: randomRefreshToken.hashed,
      sessionExpiresIn,
      refreshExpiresIn,
    };

    await this.sessionRepository.updateSession(newSessionConfig);

    return {
      token: randomSessionToken.original,
      refreshToken: randomRefreshToken.original,
      expiresIn: sessionExpiresIn,
    };
  }

  async closeSession(closeSessionInput: ExcludeSessionsServiceInput) {
    if (closeSessionInput.closeAllSessions) {
      await this.sessionRepository.excludeAllSessions(closeSessionInput);
      return { message: 'Sessões finalizadas' };
    }

    await this.sessionRepository.excludeSession(closeSessionInput);
    return { message: 'Sessão finalizada' };
  }
}
