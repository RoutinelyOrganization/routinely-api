import { Injectable } from '@nestjs/common';
import {
  CreateTaskInput,
  FindTasksRepositoryInput,
  FindTasksServiceInput,
  UpdateTaskInput,
} from './task.dtos';
import { TaskRepository } from './task.repository';
import { UnprocessableEntityError } from 'src/config/exceptions';

@Injectable()
export class TaskService {
  constructor(private repository: TaskRepository) {}

  private extractHourString(date: Date): string {
    const nowDateTime = date.toISOString();
    const nowDate = nowDateTime.split('T')[0];
    return nowDate;
  }

  async create(createTaskInput: CreateTaskInput) {
    const date = new Date(createTaskInput.date);
    const now = new Date();
    const nowDate = this.extractHourString(now);
    const hms = createTaskInput.hour;
    const hour = new Date(nowDate + 'T' + hms);

    const createdTask = await this.repository.create({
      ...createTaskInput,
      date,
      hour: hour,
    });

    const responseHour = `${createdTask.hour.getHours()}:${createdTask.hour.getMinutes()}`;
    const responseDate = createdTask.date.toISOString().split('T')[0];
    delete createdTask.createdAt;
    delete createdTask.updatedAt;
    delete createdTask.accountId;

    return { ...createdTask, hour: responseHour, date: responseDate };
  }

  async updateById(id: string, updateTaskInput: UpdateTaskInput) {
    const taskExist = await this.repository.findById(id);
    if (taskExist === null) throw new UnprocessableEntityError({});

    const date = new Date(updateTaskInput.date);
    const now = new Date();
    const nowDate = this.extractHourString(now);
    const hms = updateTaskInput.hour;
    const hour = new Date(nowDate + 'T' + hms);

    const updatedTask = await this.repository.updateById(id, {
      ...updateTaskInput,
      date,
      hour,
    });

    const responseHour = `${updatedTask.hour.getHours()}:${updatedTask.hour.getMinutes()}`;
    const responseDate = updatedTask.date.toISOString().split('T')[0];
    delete updatedTask.createdAt;
    delete updatedTask.updatedAt;
    delete updatedTask.accountId;

    return { ...updatedTask, hour: responseHour, date: responseDate };
  }

  async deleteById(id: string) {
    return await this.repository.deleteById(id);
  }

  async getAccountById(id: string) {
    return await this.repository.findAccountByTaskId(id);
  }

  async findAccountTasks({ month, year, accountId }: FindTasksServiceInput) {
    if (month > 12) month = 12;
    else if (month < 1) month = 1;

    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextMonthYear = nextMonth < month ? year + 1 : year;

    const startThisMonth = new Date(`${year}/${month}`);
    const startNextMonth = new Date(`${nextMonthYear}/${nextMonth}`);

    const filters: FindTasksRepositoryInput['filters'] = [{ accountId }];

    filters.push({
      date: {
        gte: startThisMonth,
        lt: startNextMonth,
      },
    });

    const tasks = await this.repository.findTasks(filters);
    return tasks;
  }
}
