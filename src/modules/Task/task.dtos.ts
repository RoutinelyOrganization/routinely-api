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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  hour: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  accountId: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskTags)
  tag: TaskTags;
}
