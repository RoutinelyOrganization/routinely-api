import { CreateTaskInput } from '../../task.dtos';
import { faker } from '@faker-js/faker';
import { TaskPriorities, TaskTags, TaskCategories } from '@prisma/client';

const datetime = faker.date.recent().toISOString().split('T');

export const createTaskInput: CreateTaskInput = {
  name: faker.lorem.lines(1),
  date: new Date(datetime[0]),
  hour: new Date(datetime[1]),
  description: faker.lorem.paragraph(),
  priority: TaskPriorities.low,
  tag: TaskTags.account,
  category: TaskCategories.finance,
  accountId: faker.string.uuid(),
};
