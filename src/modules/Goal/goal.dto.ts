import { GoalPeriodicity, GoalType } from '@prisma/client';
import { IsDateString } from 'class-validator';
import { IsEarlierDateThan } from 'src/utils/decorators/isEarlierDate';
export class CreateGoalInput {
  description: string;
  goal: string;

  @IsDateString()
  @IsEarlierDateThan('end_date')
  start_date: Date;
  @IsDateString()
  end_date: Date;
  periodicity: GoalPeriodicity;
  type: GoalType;
  accountId: string;
}
