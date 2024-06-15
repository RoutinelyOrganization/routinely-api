import { ResetPasswordInput } from '../../account.dtos';
import { CreateAccountControllerInput } from '../../account.dtos';
import { faker } from '@faker-js/faker';

export const createAccountInput: CreateAccountControllerInput = {
  name: faker.person.fullName(),
  email: faker.internet.email(),
  acceptedTerms: true,
  password: faker.internet.password(),
};

export const resetPasswordInput: ResetPasswordInput = {
  email: faker.internet.email(),
};
