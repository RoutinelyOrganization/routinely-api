import { faker } from '@faker-js/faker';
import { RoleLevel } from 'src/guards';
import {
  CreateSessionServiceInput,
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
  sessionExpired: 'Session expired',
  invalidCredentials: 'Invalid credentials',
  expiredOrDeleted: 'This session has expired or does not exist',
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
