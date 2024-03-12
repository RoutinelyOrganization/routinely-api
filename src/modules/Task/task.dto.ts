import { ApiProperty } from '@nestjs/swagger';
import { TaskCategories, TaskPriorities, TaskTags } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { DateRegex, MonthRegex, YearRegex } from 'src/config/constants';
import { responses } from 'src/config/responses';
import { IsEarlierThanCurrentDate } from 'src/utils/decorators/isEarlierThanCurrentDate';
import { IsValidMonth } from 'src/utils/decorators/isValidMonth';

export class CreateOneDto {
  @ApiProperty({ example: 'Uma atividade normal' })
  @IsString({ message: responses.string })
  @MaxLength(50, { message: responses.maxLength })
  @IsNotEmpty({ message: responses.notEmpty })
  name: string;

  @ApiProperty({ example: 'Descrição personalizada da atividade' })
  @IsString({ message: responses.string })
  @MaxLength(1000, { message: responses.maxLength })
  @IsNotEmpty({ message: responses.notEmpty })
  description: string;

  @ApiProperty({
    example: '2024-04-01 04:20',
    description: <string>responses.datePattern,
  })
  @IsNotEmpty({ message: responses.notEmpty })
  @IsString({ message: responses.string })
  @Matches(DateRegex, { message: responses.datePattern })
  @IsDateString({ strict: true }, { message: responses.datePattern })
  @IsEarlierThanCurrentDate('date', { message: responses.dateRange })
  date: string;

  @ApiProperty({ enum: TaskPriorities })
  @IsString({ message: responses.string })
  @IsEnum(TaskPriorities, { message: responses.enum })
  priority: TaskPriorities;

  @ApiProperty({ enum: TaskTags })
  @IsString({ message: responses.string })
  @IsEnum(TaskTags, { message: responses.enum })
  tag: TaskTags;

  @ApiProperty({ enum: TaskCategories })
  @IsString({ message: responses.string })
  @IsEnum(TaskCategories, { message: responses.enum })
  category: TaskCategories;
}

export class ReadManyDto {
  @ApiProperty({ example: '03' })
  @IsNumberString({ no_symbols: true }, { message: responses.monthPattern })
  @Matches(MonthRegex, { message: responses.monthPattern })
  @IsValidMonth('month', { message: responses.monthPattern })
  month: string;

  @ApiProperty({ example: '2024' })
  @IsNumberString({ no_symbols: true }, { message: responses.yearPattern })
  @Matches(YearRegex, { message: responses.yearPattern })
  year: string;
}
