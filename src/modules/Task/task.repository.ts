import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateTaskInput,
  FindTasksRepositoryInput,
  UpdateTaskInput,
} from './task.dtos';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async create(createTaskInput: CreateTaskInput) {
    return await this.prisma.task.create({
      data: {
        date: createTaskInput.date,
        hour: createTaskInput.hour,
        description: createTaskInput.description,
        name: createTaskInput.name,
        priority: createTaskInput.priority,
        tag: createTaskInput.tag,
        category: createTaskInput.category,
        accountId: createTaskInput.accountId,
      },
    });
  }

  async updateById(id: number, updateTaskInput: UpdateTaskInput) {
    return await this.prisma.task.update({
      where: {
        id: id,
      },
      data: updateTaskInput,
    });
  }

  async findById(id: number) {
    return await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
  }

  async deleteById(id: number) {
    return await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
  }

  async findAccountByTaskId(id: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    return task.accountId;
  }

  async findTasks(filters: FindTasksRepositoryInput['filters']) {
    const tasks = await this.prisma.task.findMany({
      where: {
        AND: filters,
      },
      select: {
        id: true,
        name: true,
        date: true,
        hour: true,
        tag: true,
        priority: true,
        category: true,
        description: true,
        checked: true,
      },
    });

    return tasks;
  }
}
