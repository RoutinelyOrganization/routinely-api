import { GoalPeriodicity, GoalType } from '@prisma/client';

export class CreateGoalInput {
  description: string;
  goal: string;
  start_date: Date;
  end_date: Date;
  accountId: string;
  periodicity: GoalPeriodicity;
  type: GoalType;
}
