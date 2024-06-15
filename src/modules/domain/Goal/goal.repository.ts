import { Injectable } from '@nestjs/common';
import { CreateGoalInput, UpdateGoalInput } from './goal.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class GoalRepository {
  constructor(private prisma: PrismaService) {}

  async create(createGoalInput: CreateGoalInput) {
    return await this.prisma.goals.create({
      data: {
        description: createGoalInput.description,
        goal: createGoalInput.goal,
        periodicity: createGoalInput.periodicity,
        type: createGoalInput.type,
        start_date: createGoalInput.start_date,
        end_date: createGoalInput.end_date,
        accountId: createGoalInput.accountId,
      },
    });
  }

  async updateById(id: string, updateGoalInput: UpdateGoalInput) {
    return await this.prisma.goals.update({
      where: { id: Number(id) },
      data: updateGoalInput,
    });
  }

  async deleteById(id: string) {
    return await this.prisma.goals.delete({ where: { id: Number(id) } });
  }

  async findAccountByGoalId(id: string) {
    const goal = await this.prisma.goals.findUnique({
      where: { id: Number(id) },
    });
    if (!goal) throw new Error('Goal not founded!');

    return goal.accountId;
  }
}
