import { faker } from '@faker-js/faker';
import { CreateSessionServiceInput } from './session.dtos';
import { RoleLevel } from 'src/guards';

export const createInput: CreateSessionServiceInput = {
  accountId: faker.string.uuid(),
  name: faker.person.fullName(),
  permissions: RoleLevel.Standard,
  remember: faker.datatype.boolean(),
};
