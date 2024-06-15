import { GenericRepository } from '@/modules/shared/repositories/generic.repository';
import { Account } from '../entities/account.entity';

export abstract class AccountRepository extends GenericRepository<Account> {
  abstract create(item: Account, profileName: string): Promise<boolean>;
}
