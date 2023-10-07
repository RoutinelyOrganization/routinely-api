import { Injectable } from '@nestjs/common';
import { CreateGoalInput, UpdateGoalInput } from './goal.dto';
import { GoalRepository } from './goal.repository';

@Injectable()
export class GoalService {
  constructor(private repository: GoalRepository) {}

  async create(createGoalInput: CreateGoalInput) {
    const start_date = new Date(createGoalInput.start_date);
    const end_date = new Date(createGoalInput.end_date);

    const createdGoal = await this.repository.create({
      ...createGoalInput,
      start_date,
      end_date,
    });

    return createdGoal;
  }

  async updateById(id: string, updateGoalInput: UpdateGoalInput) {
    const start_date = new Date(updateGoalInput.start_date);
    const end_date = new Date(updateGoalInput.end_date);

    const updatedGoal = await this.repository.updateById(id, {
      ...updateGoalInput,
      start_date,
      end_date,
    });

    return updatedGoal;
  }

  async getAccountById(id: string) {
    return await this.repository.findAccountByGoalId(id);
  }
}
