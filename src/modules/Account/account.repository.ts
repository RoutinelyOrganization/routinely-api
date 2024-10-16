import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AccessAccountRepositoryOutput,
  ChangePasswordRepositoryInput,
  CreateAccountRepositoryInput,
  UpdateAccountRepositoryInput,
} from './account.dtos';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  async createAccount({
    email,
    password,
    name,
    permissions,
  }: CreateAccountRepositoryInput): Promise<boolean> {
    const response = await this.prisma.account
      .create({
        data: {
          email,
          password,
          permissions,
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
  ): Promise<AccessAccountRepositoryOutput | null> {
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
          verifiedAt: true,
          profile: {
            select: {
              name: true,
            },
          },
        },
      })
      .then((result) => {
        if (result) {
          const name = result.profile.name;
          delete result.profile;

          return {
            ...result,
            name,
          };
        }

        return null;
      })
      .catch(() => {
        // todo: logger ({ location: 'SRC:MODULES:ACCOUNT:ACCOUNT_REPOSITORY::FIND_ACCOUNT_BY_EMAIL' );
        throw new InternalServerErrorException();
      });

    return account;
  }

  async changePassword(data: ChangePasswordRepositoryInput) {
    return await this.prisma.account
      .update({
        where: { id: data.accountId },
        data: { password: data.password },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }

  async updateAccount(data: UpdateAccountRepositoryInput) {
    return await this.prisma.account
      .update({
        where: { id: data.id },
        data: { ...data },
      })
      .catch(() => {
        throw new InternalServerErrorException();
      });
  }
}
