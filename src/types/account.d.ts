import { Account, Profile } from '@prisma/client';

export type ICreateAccountExpect = Pick<Account, 'email' | 'password'> &
  Pick<Profile, 'name'> & { acceptedTerms?: boolean };

export type ICreateAccountResponse = {
  message: string;
};
