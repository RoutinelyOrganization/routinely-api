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

  async updateById(id: string, updateTaskInput: UpdateTaskInput) {
    return await this.prisma.task.update({
      where: { id: Number(id) },
      data: updateTaskInput,
    });
  }

  async findById(id: string) {
    return await this.prisma.task.findUnique({ where: { id: Number(id) } });
  }

  async deleteById(id: string) {
    return await this.prisma.task.delete({ where: { id: Number(id) } });
  }

  async findAccountByTaskId(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: Number(id) },
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
        description: true,
      },
    });

    return tasks;
  }
}
