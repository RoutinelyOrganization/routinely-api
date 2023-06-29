import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePasswordTokenInput,
  CreatePasswordTokenOutput,
  CreatePasswordTokenRepositoryInput,
} from './passwordToken.dtos';

export class PasswordTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createPasswordTokenInput: CreatePasswordTokenRepositoryInput
  ): Promise<CreatePasswordTokenOutput> {
    return await this.prisma.resetPasswordToken.create({
      data: {
        token: createPasswordTokenInput.token,
        accountId: createPasswordTokenInput.accountId,
        expireAt: createPasswordTokenInput.accountId,
      },
    });
  }

  async findByAccountId(accountId: string) {
    return await this.prisma.resetPasswordToken.findUnique({
      where: { accountId },
    });
  }

  async deleteToken(accountId: string) {
    return await this.prisma.resetPasswordToken.delete({
      where: { accountId },
    });
  }
}
