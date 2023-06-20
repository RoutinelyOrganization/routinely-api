import { CreateAccountDto } from '../../account.dtos';
import { faker } from '@faker-js/faker';

export const createAccountInput: CreateAccountDto = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  acceptedTerms: true,
  password: faker.internet.password(),
};
