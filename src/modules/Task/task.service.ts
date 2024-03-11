import { Injectable } from '@nestjs/common';
import type { SaveOneInput } from './task.types';
import { TaskRepository } from './task.repository';
import { TimezonePtBR } from 'src/config/constants';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async saveOne(input: SaveOneInput) {
    const localeDate = new Date((<string>input.date).concat(' ', TimezonePtBR));

    await this.taskRepository.insertOne({
      ...input,
      date: localeDate,
    });
  }
}
