import { Test, TestingModule } from '@nestjs/testing';
import { TimezonePtBR } from 'src/config/constants';
import {
  DataValidationError,
  NotFoundError,
  UnprocessableEntityError,
} from 'src/config/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';
import {
  ExcludeOneInput,
  FindManyOutput,
  GetManyInput,
  GetOneInput,
  SaveOneInput,
  UpdateInput,
} from './task.types';

describe('TaskService Unit Tests', () => {
  let service: TaskService;

  const findManyResult: FindManyOutput = [
    {
      id: 1,
      date: new Date('2023-10-01'),
      finallyDate: new Date('2023-10-02'),
      name: 'Tarefa 1',
      description: 'Tarefa 1',
      category: 'Career',
      accountId: '123',
      quantityPerWeek: 1,
      type: 'habit',
      weekDays: [],
      checked: false,
    },
  ];
  const taskRepositoryMock = {
    insertOne: jest.fn(),
    findMany: jest.fn().mockReturnValue(findManyResult),
    findOne: jest.fn().mockReturnValue(findManyResult[0]),
    findAccountIdByTaskId: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  const fackData: SaveOneInput = {
    date: '2022-01-01',
    finallyDate: '2022-01-02',
    name: 'Tarefa 1',
    description: 'Tarefa 1',
    category: 'Career',
    accountId: '123',
    quantityPerWeek: 1,
    weekDays: [],
    type: 'habit',
  };

  const transformDate = (date: string): Date => {
    return new Date(date.concat(' ', TimezonePtBR));
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Save one', () => {
    it('Happy path - should return a SaveOneOutput', async () => {
      const insertOneSpy = jest.spyOn(taskRepositoryMock, 'insertOne');

      await service.saveOne(fackData);
      const expected = {
        ...fackData,
        date: transformDate(fackData.date),
        finallyDate: transformDate(fackData.finallyDate),
      };
      expect(insertOneSpy).toBeCalledWith(expected);
    });
  });
  describe('getMany', () => {
    it('should calculate next month and year correctly', async () => {
      const input: GetManyInput = { month: '12', year: '2023', accountId: '1' };
      await service.getMany(input);
      expect(taskRepositoryMock.findMany).toHaveBeenCalledWith({
        accountId: input.accountId,
        dateRange: {
          start: new Date('2023/12'),
          end: new Date('2024/1'),
        },
      });
    });

    it('should handle same year correctly', async () => {
      const input: GetManyInput = { month: '5', year: '2023', accountId: '1' };
      await service.getMany(input);
      expect(taskRepositoryMock.findMany).toHaveBeenCalledWith({
        accountId: input.accountId,
        dateRange: {
          start: new Date('2023/5'),
          end: new Date('2023/6'),
        },
      });
    });

    it('should call findMany with correct arguments', async () => {
      const input: GetManyInput = { month: '7', year: '2023', accountId: '1' };
      taskRepositoryMock.findMany.mockResolvedValue(findManyResult);

      const result = await service.getMany(input);

      expect(taskRepositoryMock.findMany).toHaveBeenCalledWith({
        accountId: input.accountId,
        dateRange: {
          start: new Date('2023/7'),
          end: new Date('2023/8'),
        },
      });
      expect(result).toBe(findManyResult);
    });

    it('should return the result from the repository', async () => {
      const input: GetManyInput = { month: '10', year: '2023', accountId: '1' };

      const result = await service.getMany(input);

      expect(result).toEqual(findManyResult);
    });

    it('should handle repository errors gracefully', async () => {
      const input: GetManyInput = { month: '11', year: '2023', accountId: '1' };
      taskRepositoryMock.findMany.mockRejectedValue(
        new Error('Repository error')
      );

      try {
        await service.getMany(input);
      } catch (e) {
        expect(e).toEqual(new Error('Repository error'));
      }
    });
  });
  describe('getOne', () => {
    it('should convert input.id to a number', async () => {
      const input: GetOneInput = { id: '1', accountId: '123' };
      await service.getOne(input);
      expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should return task if accountId matches', async () => {
      const input: GetOneInput = { id: '1', accountId: '123' };
      const resultMock = { id: 1, accountId: '123', name: 'Task 1' };
      taskRepositoryMock.findOne.mockResolvedValue(resultMock);

      const result = await service.getOne(input);

      expect(result).toEqual({ id: 1, name: 'Task 1' });
    });

    it('should return null if accountId does not match', async () => {
      const input: GetOneInput = { id: '1', accountId: '123' };
      const resultMock = { id: 1, accountId: '456', name: 'Task 1' };
      taskRepositoryMock.findOne.mockResolvedValue(resultMock);

      const result = await service.getOne(input);

      expect(result).toBeNull();
    });

    it('should return null if task is not found', async () => {
      const input: GetOneInput = { id: '1', accountId: '123' };
      taskRepositoryMock.findOne.mockResolvedValue(null);

      const result = await service.getOne(input);

      expect(result).toBeNull();
    });

    it('should handle repository errors gracefully', async () => {
      const input: GetOneInput = { id: '1', accountId: '123' };
      taskRepositoryMock.findOne.mockRejectedValue(
        new Error('Repository error')
      );

      try {
        await service.getOne(input);
      } catch (e) {
        expect(e).toEqual(new Error('Repository error'));
      }
    });
  });
  describe('update', () => {
    const updateInput: UpdateInput = {
      id: 1,
      accountId: '123',
      name: 'Updated Task',
    };

    it('should throw DataValidationError if no fields are provided for update', async () => {
      const emptyInput: UpdateInput = { id: 1, accountId: '123' };

      await expect(service.update(emptyInput)).rejects.toThrow(
        DataValidationError
      );
    });

    it('should throw NotFoundError if task is not found', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue(null);

      await expect(service.update(updateInput)).rejects.toThrow(NotFoundError);
    });

    it('should throw UnprocessableEntityError if the user is not the owner', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue('456');

      await expect(service.update(updateInput)).rejects.toThrow(
        UnprocessableEntityError
      );
    });

    it('should call updateOne with correct arguments', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue('123');

      await service.update(updateInput);

      expect(taskRepositoryMock.updateOne).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Task',
        description: undefined,
        date: undefined,
        finallyDate: undefined,
        category: undefined,
        quantityPerWeek: undefined,
        weekDays: undefined,
        type: undefined,
        checked: undefined,
      });
    });

    it('should handle date transformation correctly', async () => {
      const inputWithDates: UpdateInput = {
        id: 1,
        accountId: '123',
        date: '2022-01-01',
        finallyDate: '2022-01-02',
      };

      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue('123');

      await service.update(inputWithDates);

      expect(taskRepositoryMock.updateOne).toHaveBeenCalledWith({
        id: 1,
        name: undefined,
        description: undefined,
        date: transformDate('2022-01-01'),
        finallyDate: transformDate('2022-01-02'),
        category: undefined,
        quantityPerWeek: undefined,
        weekDays: undefined,
        type: undefined,
        checked: undefined,
      });
    });
  });
  describe('excludeOne', () => {
    const excludeOneInput: ExcludeOneInput = {
      id: '1',
      accountId: '123',
    };

    it('should throw NotFoundError if task is not found', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue(null);

      await expect(service.excludeOne(excludeOneInput)).rejects.toThrow(
        NotFoundError
      );
    });

    it('should throw UnprocessableEntityError if the user is not the owner', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue('456');

      await expect(service.excludeOne(excludeOneInput)).rejects.toThrow(
        UnprocessableEntityError
      );
    });

    it('should call deleteOne with correct arguments', async () => {
      taskRepositoryMock.findAccountIdByTaskId.mockResolvedValue('123');

      await service.excludeOne(excludeOneInput);

      expect(taskRepositoryMock.deleteOne).toHaveBeenCalledWith(1);
    });
  });
});
