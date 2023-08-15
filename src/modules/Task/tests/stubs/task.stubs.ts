import { CreateTaskInput } from '../../task.dtos';
import { faker } from '@faker-js/faker';
import { TaskPriorities, TaskTags } from '../../task.dtos';

export const createTaskInput: CreateTaskInput = {
  name: faker.lorem.lines(1),
  deadline: faker.date.soon(),
  description: faker.lorem.paragraph(),
  priority: TaskPriorities.low,
  tag: TaskTags.finance,
};
