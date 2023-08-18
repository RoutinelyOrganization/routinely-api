import { Controller, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskInput } from './task.dtos';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskInput: CreateTaskInput) {
    const createdTask = await this.taskService.create(createTaskInput);
    return createdTask;
  }
}
