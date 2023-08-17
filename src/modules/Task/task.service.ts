import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './task.dtos';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private repository: TaskRepository) {}
  async create(createTaskInput: CreateTaskInput) {
    const date = new Date(createTaskInput.date);
    const now = new Date();
    const nowDateTime = now.toISOString();
    const nowDate = nowDateTime.split('T')[0];
    const hms = createTaskInput.hour;
    const hour = new Date(nowDate + 'T' + hms);
    const createdTask = await this.repository.create({
      ...createTaskInput,
      date,
      hour: hour,
    });

    const responseHour = `${createdTask.hour.getHours()}:${createdTask.hour.getMinutes()}`;
    const responseDate = createdTask.date.toISOString().split('T')[0];
    return { ...createdTask, hour: responseHour, date: responseDate };
  }
}
