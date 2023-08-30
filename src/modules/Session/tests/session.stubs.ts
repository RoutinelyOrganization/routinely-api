import { faker } from '@faker-js/faker';
import { RoleLevel } from 'src/guards';
import {
  CreateSessionServiceInput,
  FindSessionServiceOutput,
} from '../session.dtos';

export const createInput: CreateSessionServiceInput = {
  accountId: faker.string.uuid(),
  name: faker.person.fullName(),
  permissions: RoleLevel.Standard,
  remember: faker.datatype.boolean(),
};

export const findByTokenInput = {
  token: faker.string.hexadecimal(),
};

export const findByTokenOutput: FindSessionServiceOutput = {
  accountId: faker.string.uuid(),
  permissions: RoleLevel.Standard,
};
