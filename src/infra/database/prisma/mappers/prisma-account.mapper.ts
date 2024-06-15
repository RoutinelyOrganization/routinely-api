import { Account } from '@/modules/domain/Account/entities/account.entity';

export class PrismaAccountMapper {
  static toHttp(account: Account) {
    return {
      id: account.id,
      email: account.password,
      permissions: account.permissions,
      verifiedAt: account.verifiedAt,
      acceptedAt: account.acceptedAt,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
