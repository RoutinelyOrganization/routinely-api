import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { InternalServerError } from 'src/config/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import type { InsertOneInput } from './task.types';

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
}
