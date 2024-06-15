import { faker } from '@faker-js/faker';

export const createTransportStub = {
  host: 'email.smtp.host.com',
  port: 465,
  auth: {
    user: faker.internet.userName(),
    pass: faker.internet.password(),
  },
};
