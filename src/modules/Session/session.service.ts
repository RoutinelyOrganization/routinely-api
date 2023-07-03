import { randomBytes } from 'node:crypto';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionRepository } from './session.repository';
import {
  CreateSessionServiceInput,
  CreateSessionServiceOutput,
  FindSessionServiceOutput,
  RefreshTokenServiceOutput,
} from './session.dtos';
import { hashDataAsync } from 'src/utils/hashes';

@Injectable()
export class SessionService {
  private expiresInAHour = 36e5;
  private expiresInAWeek = 36e5 * 24 * 7;

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
        throw new InternalServerErrorException('Error on try create session');
      }
    }

    return {
      original: token,
      hashed: hashedToken || undefined,
    };
  };

  private calcTokensExpirationDate = (remember = false) => {
    const sessionTokenExpiresIn = remember
      ? this.expiresInAWeek
      : this.expiresInAHour;
    const refreshTokenExpiresIn = sessionTokenExpiresIn * (remember ? 4 : 1.5); // 1 month : 1h 30min
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
      throw new InternalServerErrorException();
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
      throw new UnauthorizedException('Session expired');
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
      throw new UnauthorizedException(
        'This session has expired or does not exist'
      );
    }

    const hashedRefreshToken = await hashDataAsync(
      refreshToken,
      process.env.SALT_SESSION
    );

    if (!hashedRefreshToken) {
      throw new InternalServerErrorException('Error on try verify session');
    }

    if (hashedRefreshToken !== expiredSession.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
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
}
