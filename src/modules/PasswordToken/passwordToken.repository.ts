import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePasswordTokenInput } from './passwordToken.dtos';

export class PasswordTokenRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createPasswordTokenInput: CreatePasswordTokenInput
  ): Promise<any> {
    await this.prisma.resetPasswordToken.create({
      data: {
        token: createPasswordTokenInput.token,
        accountId: createPasswordTokenInput.accountId,
        expireAt: createPasswordTokenInput.expireAt,
      },
    });
  }
}
