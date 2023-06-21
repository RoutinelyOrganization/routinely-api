import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ICreateAccountRepositoryExpect,
  IAccessAccountRepositoryResponse,
} from 'src/types/account';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  async createAccount({
    email,
    password,
    name,
  }: ICreateAccountRepositoryExpect): Promise<boolean> {
    const response = await this.prisma.account
      .create({
        data: {
          email,
          password,
          profile: {
            create: {
              name,
            },
          },
        },
      })
      .then((accountData) => {
        return !!accountData;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_REPOSITORY::CREATE_ACCOUNT' );
        throw new InternalServerErrorException();
      });

    return response;
  }

  async alreadyExists(email: string): Promise<boolean> {
    const response = await this.prisma.account
      .count({
        where: {
          email,
        },
      })
      .then((response) => {
        return response > 0;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_REPOSITORY::ALREADY_EXISTS' );
        throw new InternalServerErrorException();
      });

    return response;
  }

  async findAccountByEmail(
    email: string
  ): Promise<IAccessAccountRepositoryResponse | null> {
    const account = await this.prisma.account
      .findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          permissions: true,
          profile: {
            select: {
              name: true,
            },
          },
        },
      })
      .then((result) => {
        return result;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_REPOSITORY::FIND_ACCOUNT_BY_EMAIL' );
        throw new InternalServerErrorException();
      });

    return account;
  }
}
