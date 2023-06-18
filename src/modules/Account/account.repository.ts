import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ICreateAccountExpect } from 'src/types/account';

@Injectable()
export class AccountRepository {
  constructor(private prisma: PrismaService) {}

  async createAccount({
    email,
    password,
    name,
  }: ICreateAccountExpect): Promise<boolean> {
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
}
