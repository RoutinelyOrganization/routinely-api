import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InternalServerError } from 'src/config/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  FindManyInput,
  FindManyOutput,
  FindOneOutput,
  InsertOneInput,
  TaskId,
  UpdateOneInput,
} from './task.types';

@Injectable()
export class TaskRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async insertOne(input: InsertOneInput): Promise<void> {
    await this.prismaService.task
      .create({
        data: {
          name: input.name,
          description: input.description,
          date: input.date,
          category: input.category,
          finallyDate: input.finallyDate,
          quantityPerWeek: input.quantityPerWeek,
          weekDays: input.weekDays,
          type: input.type,
          account: {
            connect: {
              id: input.accountId,
            },
          },
        },
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }

  async findMany(input: FindManyInput): Promise<FindManyOutput> {
    return await this.prismaService.task
      .findMany({
        where: {
          AND: [
            { accountId: input.accountId },
            {
              date: {
                gte: input.dateRange.start,
                lte: input.dateRange.end,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          date: true,
          category: true,
          checked: true,
          finallyDate: true,
          quantityPerWeek: true,
        },
        orderBy: [
          {
            date: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      })
      .then((response) => {
        return response ?? [];
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }

  async findOne(taskId: TaskId): Promise<FindOneOutput> {
    return await this.prismaService.task
      .findUnique({
        where: {
          id: taskId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          date: true,
          category: true,
          checked: true,
          accountId: true,
          finallyDate: true,
          quantityPerWeek: true,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }

  async findAccountIdByTaskId(taskId: TaskId): Promise<string | null> {
    return await this.prismaService.task
      .findUniqueOrThrow({
        where: {
          id: taskId,
        },
        select: {
          accountId: true,
        },
      })
      .then((response) => {
        return response.accountId ?? null;
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return null;
          }

          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }

  async updateOne(input: UpdateOneInput) {
    await this.prismaService.task
      .update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          date: input.date,
          finallyDate: input.finallyDate,
          quantityPerWeek: input.quantityPerWeek,
          category: input.category,
          checked: input.checked,
        },
        select: {
          id: true,
        },
      })
      .catch((error: unknown) => {
        console.log(error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }

  async deleteOne(taskId: TaskId) {
    await this.prismaService.task
      .delete({
        where: {
          id: taskId,
        },
      })
      .catch((error: unknown) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            return null;
          }

          throw new InternalServerError({
            message: 'Erro desconhecido :: '.concat(error.code),
          });
        }

        throw new InternalServerError({});
      });
  }
}
