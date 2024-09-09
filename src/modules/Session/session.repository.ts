import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateSessionRepositoryInput,
  ExcludeSessionRepositoryInput,
  FindExpiredSessionRepositoryInput,
  FindExpiredSessionRepositoryOutput,
  FindSessionRepositoryInput,
  FindSessionRepositoryOutpout,
  UpdateSessionRepositoryInput,
} from './session.dtos';

@Injectable()
export class SessionRepository {
  constructor(private prisma: PrismaService) {}

  async excludeSession({
    sessionToken,
  }: ExcludeSessionRepositoryInput): Promise<boolean> {
    return await this.prisma.session
      .delete({
        where: {
          sessionToken,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::EXCLUDE_SESSION' );
        throw new InternalServerErrorException();
      });
  }

  async excludeAllSessions({
    accountId,
  }: ExcludeSessionRepositoryInput): Promise<boolean> {
    return await this.prisma.session
      .deleteMany({
        where: {
          accountId,
        },
      })
      .then(() => {
        return true;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:SESSION:SESSION_REPOSITORY::EXCLUDE_ALL_SESSION' );
        throw new InternalServerErrorException();
      });
  }

  async createSession(data: CreateSessionRepositoryInput): Promise<boolean> {
    return await this.prisma.session
      .create({
        data: {
          ...data,
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
