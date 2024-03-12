import { Injectable } from '@nestjs/common';
import type { FindManyOutput, GetManyInput, SaveOneInput } from './task.types';
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

  async getMany(input: GetManyInput): Promise<FindManyOutput> {
    const month = Number(input.month);
    const year = Number(input.year);

    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = nextMonth < month ? year + 1 : year;

    const start = new Date(`${year}/${month}`);
    const end = new Date(`${nextYear}/${nextMonth}`);

    const result = await this.taskRepository.findMany({
      accountId: input.accountId,
      dateRange: {
        start: start,
        end: end,
      },
    });

    return result;
  }
}
