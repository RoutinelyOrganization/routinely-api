import { faker } from '@faker-js/faker';
import { RoleLevel } from 'src/guards';
import {
  CreateSessionServiceInput,
  ExcludeSessionsServiceInput,
  FindExpiredSessionRepositoryOutput,
  FindSessionRepositoryOutpout,
} from '../session.dtos';
import { hashData } from 'src/utils/hashes';

const sessionId = faker.number.int();
const accountId = faker.string.uuid();
const permissions = RoleLevel.Standard;
const token = faker.string.hexadecimal({ length: 20 });
const refreshToken = faker.string.hexadecimal({ length: 20 });
const remember = faker.datatype.boolean();
const username = faker.person.fullName();

export const expectedMessages = {
  sessionExpired: 'Sessão expirada',
  invalidCredentials: 'Credenciais inválidas',
  expiredOrDeleted: 'Essa sessão está expirada ou foi finalizada',
  manySessionClosed: 'Sessões finalizadas',
  aClosedSession: 'Sessão finalizada',
};

export const createInput: CreateSessionServiceInput = {
  accountId,
  permissions,
  remember,
  name: username,
};

export const findByTokenInput = { token };

export const findByTokenOutput: FindSessionRepositoryOutpout = {
  accountId,
  permissions,
};

export const findExpiredByTokenInput = {
  token,
  refreshToken,
};

export const findExpiredByTokenOutput: FindExpiredSessionRepositoryOutput = {
  id: sessionId,
  refreshToken: hashData(refreshToken, process.env.SALT_SESSION),
  remember,
};

export const closeASessionInput: ExcludeSessionsServiceInput = {
  accountId,
  sessionToken: token,
  closeAllSessions: false,
};

export const closeManySessionInput = {
  ...closeASessionInput,
  closeAllSessions: true,
};
