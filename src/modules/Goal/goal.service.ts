import { Injectable } from '@nestjs/common';
import { CreateGoalInput } from './goal.dto';
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
}
