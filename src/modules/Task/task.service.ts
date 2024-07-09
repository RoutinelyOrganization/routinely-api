import { Injectable } from '@nestjs/common';
import { TimezonePtBR } from 'src/config/constants';
import {
  DataValidationError,
  NotFoundError,
  UnprocessableEntityError,
} from 'src/config/exceptions';
import { TaskRepository } from './task.repository';
import type {
  ExcludeOneInput,
  FindManyOutput,
  GetManyInput,
  GetOneInput,
  SaveOneInput,
  UpdateInput,
} from './task.types';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  private transformDate(date: string): Date {
    return new Date(date.concat(' ', TimezonePtBR));
  }

  async saveOne(input: SaveOneInput) {
    const localeDate = this.transformDate(input.date);
    const localeFinnalyDate = input.finallyDate
      ? this.transformDate(input.finallyDate)
      : null;

    try {
      await this.taskRepository.insertOne({
        ...input,
        date: localeDate,
        finallyDate: localeFinnalyDate,
      });
    } catch (error) {
      console.log(error);
    }
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

  async getOne(input: GetOneInput) {
    const taskId = Number(input.id);
    const result = await this.taskRepository.findOne(taskId);
    const isOwner = result && result.accountId === input.accountId;
    const task = isOwner ? (delete result.accountId, result) : null;

    return task;
  }

  async update(input: UpdateInput) {
    if (
      !input.name &&
      !input.description &&
      !input.date &&
      !input.category &&
      !input.checked &&
      !input.finallyDate &&
      !input.quantityPerWeek &&
      !input.weekDays &&
      !input.type
    ) {
      throw new DataValidationError({
        message: 'Modifique ao menos uma informação',
      });
    }

    const currentAccountId = await this.taskRepository.findAccountIdByTaskId(
      input.id
    );

    if (!currentAccountId) {
      throw new NotFoundError({
        message: 'Tarefa (id: ' + String(input.id) + ') não foi encontrada.',
      });
    }

    const isOwner = currentAccountId === input.accountId;

    if (!isOwner) {
      throw new UnprocessableEntityError({});
    }

    const date = input.date && this.transformDate(<string>input.date);
    const finallyDate =
      input.finallyDate && this.transformDate(<string>input.finallyDate);

    await this.taskRepository.updateOne({
      id: input.id,
      name: input.name ?? undefined,
      description: input.description ?? undefined,
      date: date ?? undefined,
      finallyDate: finallyDate ?? undefined,
      category: input.category ?? undefined,
      quantityPerWeek: input.quantityPerWeek ?? undefined,
      weekDays: input.weekDays ?? undefined,
      type: input.type ?? undefined,
      checked: input.checked ?? undefined,
    });
  }

  async excludeOne(input: ExcludeOneInput) {
    const taskId = Number(input.id);

    const currentAccountId = await this.taskRepository.findAccountIdByTaskId(
      taskId
    );

    if (!currentAccountId) {
      throw new NotFoundError({
        message: 'Tarefa (id: ' + String(input.id) + ') não foi encontrada.',
      });
    }

    const isOwner = currentAccountId === input.accountId;

    if (!isOwner) {
      throw new UnprocessableEntityError({});
    }

    await this.taskRepository.deleteOne(taskId);
  }
}
