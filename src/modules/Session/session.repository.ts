import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionRepositoryInput } from './session.dtos';

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
}
