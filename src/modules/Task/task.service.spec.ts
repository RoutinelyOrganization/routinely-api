import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskRepository } from './task.repository';
import { createTaskInput } from './tests/stubs/task.stubs';

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
    it('calls TaskRepository.create with correct params', async () => {
      const taskRepositorySpy = jest.spyOn(taskRepositoryMock, 'create');

      await service.create(createTaskInput);

      expect(taskRepositorySpy).toHaveBeenCalledTimes(1);
      expect(taskRepositorySpy).toHaveBeenCalledWith(createTaskInput);
    });

    it('returns correct response', async () => {
      taskRepositoryMock.create.mockResolvedValue(createTaskInput);

      const response = await service.create(createTaskInput);

      expect(response).toEqual(createTaskInput);
    });
  });
});
