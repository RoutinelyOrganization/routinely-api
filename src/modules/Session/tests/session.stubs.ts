import { faker } from '@faker-js/faker';
import { RoleLevel } from 'src/guards';
import {
  CreateSessionServiceInput,
  FindSessionServiceOutput,
} from '../session.dtos';

const accountId = faker.string.uuid();
const permissions = RoleLevel.Standard;

export const createInput: CreateSessionServiceInput = {
  accountId,
  permissions,
  name: faker.person.fullName(),
  remember: faker.datatype.boolean(),
};

export const findByTokenInput = {
  token: faker.string.hexadecimal(),
};

export const findByTokenOutput: FindSessionServiceOutput = {
  accountId,
  permissions,
};
