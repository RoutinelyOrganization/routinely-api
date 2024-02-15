import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TaskPriorities, TaskTags, TaskCategories } from '@prisma/client';
import { Transform } from 'class-transformer';
import { responses } from 'src/config/responses';

export class CreateTaskInput {
  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  name: string;

  @ApiProperty({ example: '2023-09-14' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsDateString(undefined, { message: responses.datePattern })
  date: Date;

  @ApiProperty({ example: '15:30' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  hour: Date;

  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  description: string;

  accountId: string;

  @ApiProperty({ enum: TaskPriorities, example: 'medium' })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  @IsEnum(TaskPriorities)
  priority: TaskPriorities;

  @ApiProperty({ enum: TaskTags, example: TaskTags['literature'] })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  @IsEnum(TaskTags)
  tag: TaskTags;

  @ApiProperty({ enum: TaskCategories, example: TaskCategories['personal'] })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
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
]) {
  @ApiProperty({ type: Boolean, example: false })
  @IsBoolean({ message: responses.boolean })
  checked = false;
}

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

export class FindTasksControllerDto {
  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @Transform((params) => Number(params.value))
  @IsNumber(undefined, { message: responses.number })
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @Transform((params) => Number(params.value))
  @IsNumber(undefined, { message: responses.number })
  @Min(2023)
  year: number;
}

export class TaskIdDto {
  @ApiProperty()
  @IsNotEmpty({ message: responses.notEmpty })
  @Transform((params) => Number(params.value))
  @IsNumber(undefined, { message: responses.number })
  @Min(1)
  id: number;
}
