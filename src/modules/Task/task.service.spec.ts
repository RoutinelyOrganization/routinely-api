import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskInput, TaskPriorities, TaskTags } from './task.dtos';
import { faker } from '@faker-js/faker';
import { TaskRepository } from './task.repository';

describe('TaskService Unit Tests', () => {
  let service: TaskService;

  const taskRepositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        PrismaService,
        { provide: TaskRepository, useValue: taskRepositoryMock },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  describe('#create', () => {
    const createTaskInput: CreateTaskInput = {
      name: faker.lorem.lines(1),
      deadline: faker.date.soon(),
      description: faker.lorem.paragraph(),
      priority: TaskPriorities.low,
      tag: TaskTags.finance,
    };

    it('calls TaskRepository.create with correct params', async () => {
      const taskRepositorySpy = jest.spyOn(taskRepositoryMock, 'create');

      await service.create(createTaskInput);

      expect(taskRepositorySpy).toHaveBeenCalledTimes(1);
      expect(taskRepositorySpy).toHaveBeenCalledWith(createTaskInput);
    });
  });
});
