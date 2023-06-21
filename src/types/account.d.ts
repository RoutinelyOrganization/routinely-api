import { Account, Profile } from '@prisma/client';

export type ICreateAccountRepositoryExpect = Pick<
  Account,
  'email' | 'password'
> &
  Pick<Profile, 'name'>;

export type ICreateAccountServiceResponse = {
  message: string;
};

// Access
export type IAccessAccountRepositoryResponse = Pick<
  Account,
  'id' | 'email' | 'password' | 'permissions'
> & {
  profile: Pick<Profile, 'name'>;
};

export type IAccessAccountServiceResponse = Pick<
  IAccessAccountRepositoryResponse,
  'id' | 'permissions' | 'profile'
>;
