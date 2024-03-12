import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InternalServerError } from 'src/config/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  FindManyInput,
  FindManyOutput,
  FindOneInput,
  FindOneOutput,
  InsertOneInput,
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
          tag: input.tag,
          priority: input.priority,
          category: input.category,
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
          tag: true,
          category: true,
          priority: true,
          checked: true,
        },
        orderBy: [
          {
            date: 'asc',
          },
          {
            priority: 'desc',
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

  async findOne(taskId: FindOneInput): Promise<FindOneOutput> {
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
          tag: true,
          priority: true,
          category: true,
          checked: true,
          accountId: true,
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
}
