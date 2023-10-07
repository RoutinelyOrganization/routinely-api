import { ApiProperty } from '@nestjs/swagger';
import { GoalPeriodicity, GoalType } from '@prisma/client';
import { IsDateString, IsEnum, MaxLength } from 'class-validator';
import { IsEarlierDateThan } from 'src/utils/decorators/isEarlierDate';
export class CreateGoalInput {
  @ApiProperty({ maxLength: 1000 })
  @MaxLength(1000)
  description: string;

  @ApiProperty({ maxLength: 200 })
  @MaxLength(200)
  goal: string;

  @ApiProperty({ example: '2023-09-14' })
  @IsDateString()
  @IsEarlierDateThan('end_date')
  start_date: Date;

  @ApiProperty({ example: '2023-09-20' })
  @IsDateString()
  end_date: Date;

  @ApiProperty({ enum: GoalPeriodicity, example: 'monthly' })
  @IsEnum(GoalPeriodicity)
  periodicity: GoalPeriodicity;

  @ApiProperty({ enum: GoalType, example: 'personal' })
  @IsEnum(GoalType)
  type: GoalType;

  @ApiProperty()
  accountId: string;
}
