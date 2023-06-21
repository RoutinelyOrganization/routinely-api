import { Session } from '@prisma/client';

export type ICreateSessionRepositoryExpect = Omit<
  Session,
  'id' | 'createdAt' | 'updatedAt'
>;

export type ICreateSessionRepositoryResponse = Pick<
  Session,
  'sessionExpiresIn' | 'accountId' | 'permissions' | 'name'
>;

export type ICreateSessionServiceExpect = Pick<
  Session,
  'accountId' | 'permissions' | 'name'
> & {
  remember: boolean;
};

export type ICreateSessionServiceResponse = Pick<
  Session,
  'permissions' | 'name'
> & {
  token: string;
  refreshToken: string;
  expiresIn: Date;
};
