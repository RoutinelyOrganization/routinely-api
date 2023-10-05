import { Injectable } from '@nestjs/common';
import { CreateGoalInput } from './goal.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
