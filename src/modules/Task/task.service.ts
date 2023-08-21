import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTaskInput, UpdateTaskInput } from './task.dtos';
import { TaskRepository } from './task.repository';

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
    if (taskExist === null) throw new UnprocessableEntityException();

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
}
