import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateSessionRepositoryInput,
  FindExpiredSessionRepositoryInput,
  FindExpiredSessionRepositoryOutput,
  FindSessionRepositoryInput,
  FindSessionRepositoryOutpout,
  UpdateSessionRepositoryInput,
} from './session.dtos';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async createSession({
    sessionToken,
    refreshToken,
    sessionExpiresIn,
    refreshExpiresIn,
    accountId,
    permissions,
    name,
  }: CreateSessionRepositoryInput): Promise<boolean> {
    return await this.prisma.session
      .create({
        data: {
          sessionToken,
          refreshToken,
          sessionExpiresIn,
          refreshExpiresIn,
          accountId,
          permissions,
          name,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::CREATE_SESSION' );
        throw new InternalServerErrorException();
      });
  }

  async findSessionByToken({
    sessionToken,
  }: FindSessionRepositoryInput): Promise<FindSessionRepositoryOutpout | null> {
    return await this.prisma.session
      .findFirst({
        where: {
          AND: [
            {
              sessionToken,
            },
            {
              sessionExpiresIn: {
                gt: new Date(),
              },
            },
          ],
        },
        select: {
          accountId: true,
          permissions: true,
        },
      })
      .then((result) => {
        return result;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::FIND_SESSION_BY_TOKEN' );
        throw new InternalServerErrorException();
      });
  }

  async findExpiredSessionByToken({
    sessionToken,
  }: FindExpiredSessionRepositoryInput): Promise<FindExpiredSessionRepositoryOutput | null> {
    const now = new Date();

    return await this.prisma.session
      .findFirst({
        where: {
          sessionToken,
          sessionExpiresIn: {
            lt: now,
          },
          refreshExpiresIn: {
            gt: now,
          },
        },
        select: {
          id: true,
          refreshToken: true,
          remember: true,
        },
      })
      .then((result) => {
        return result;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::FIND_EXPIRED_SESSION_BY_TOKEN' );
        throw new InternalServerErrorException();
      });
  }

  async updateSession({
    id,
    sessionToken,
    refreshToken,
    sessionExpiresIn,
    refreshExpiresIn,
  }: UpdateSessionRepositoryInput): Promise<boolean> {
    return await this.prisma.session
      .update({
        where: {
          id,
        },
        data: {
          sessionToken,
          refreshToken,
          sessionExpiresIn,
          refreshExpiresIn,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::UPDATE__SESSION' );
        throw new InternalServerErrorException();
      });
  }
}
