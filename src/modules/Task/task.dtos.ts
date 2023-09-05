import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TaskPriorities {
  low = 'low',
  medium = 'medium',
  high = 'high',
  urgent = 'urgent',
}

export enum TaskTags {
  personal = 'personal',
  study = 'study',
  finance = 'finance',
  career = 'career',
  health = 'health',
}

export class CreateTaskInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  hour: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskTags)
  tag: TaskTags;
}

export class UpdateTaskInput extends PickType(CreateTaskInput, [
  'accountId',
  'date',
  'description',
  'hour',
  'name',
  'priority',
  'tag',
]) {}

export class FindTasksRepositoryInput {
  filters: Array<{
    [key: string]: string | Array<unknown> | object;
  }>;
}

export class FindTasksServiceInput {
  month: number;
  year: number;
  accountId: string;
}
