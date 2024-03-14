import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskPriorities, TaskTags, TaskCategories } from '@prisma/client';

export class CreateTaskInput {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '2023-09-14' })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({ example: '15:30' })
  @IsNotEmpty()
  @IsString()
  hour: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  accountId: string;

  @ApiProperty({ enum: TaskPriorities, example: 'medium' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @ApiProperty({ enum: TaskTags, example: TaskTags['literature'] })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskTags)
  tag: TaskTags;

  @ApiProperty({ enum: TaskCategories, example: TaskCategories['personal'] })
  @IsNotEmpty()
  @IsString()
  @IsEnum(TaskCategories)
  category: TaskCategories;
}

export class UpdateTaskInput extends PickType(CreateTaskInput, [
  'accountId',
  'date',
  'description',
  'hour',
  'name',
  'priority',
  'tag',
  'category',
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