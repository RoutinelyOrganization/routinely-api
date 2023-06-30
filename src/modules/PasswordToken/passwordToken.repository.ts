import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePasswordTokenInput,
  CreatePasswordTokenOutput,
  CreatePasswordTokenRepositoryInput,
} from './passwordToken.dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createPasswordTokenInput: CreatePasswordTokenRepositoryInput
  ): Promise<CreatePasswordTokenOutput> {
    return await this.prisma.resetPasswordToken.create({
      data: {
        token: createPasswordTokenInput.token,
        accountId: createPasswordTokenInput.accountId,
      },
    });
  }

  async findByAccountId(accountId: string) {
    return await this.prisma.resetPasswordToken.findFirst({
      where: { accountId },
    });
  }

  async findByToken(token: string) {
    return await this.prisma.resetPasswordToken.findUnique({
      where: { token },
    });
  }

  async deleteToken(accountId: string) {
    return await this.prisma.resetPasswordToken.delete({
      where: { accountId },
    });
  }
}
