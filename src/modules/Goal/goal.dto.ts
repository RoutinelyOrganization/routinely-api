import { GoalPeriodicity, GoalType } from '@prisma/client';
import { IsDateString, IsEnum, MaxLength } from 'class-validator';
import { IsEarlierDateThan } from 'src/utils/decorators/isEarlierDate';
export class CreateGoalInput {
  @MaxLength(1000)
  description: string;

  @MaxLength(200)
  goal: string;

  @IsDateString()
  @IsEarlierDateThan('end_date')
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsEnum(GoalPeriodicity)
  periodicity: GoalPeriodicity;

  @IsEnum(GoalType)
  type: GoalType;

  accountId: string;
}
