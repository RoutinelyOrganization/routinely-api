import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './task.dtos';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private repository: TaskRepository) {}
  async create(createTaskInput: CreateTaskInput) {
    const createdTask = await this.repository.create(createTaskInput);
    return createdTask;
  }
}
