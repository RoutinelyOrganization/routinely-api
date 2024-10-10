import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { AccountId } from 'src/utils/decorators/accountid.decorator';
import {
  CreateOneDto,
  DeleteOneDto,
  ReadManyDto,
  ReadOneDto,
  UpdateOneDto,
} from './task.dto';
import { TaskService } from './task.service';

@ApiTags('Tarefas')
@UseGuards(RolesGuard)
@ApiBearerAuth()
@Controller('/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(201)
  @RequirePermissions([Permissions['300']])
  async createOne(@Body() input: CreateOneDto, @AccountId() accountId: string) {
    await this.taskService.saveOne({
      name: input.name,
      description: input.description,
      date: input.date,
      category: input.category,
      accountId: accountId,
      finallyDate: input.finallyDate,
      quantityPerWeek: input.quantityPerWeek,
      weekDays: input.weekDays,
      type: input.type,
    });

    return {
      message: 'Tarefa criada com sucesso!',
    };
  }

  @Get()
  @HttpCode(200)
  @RequirePermissions([Permissions['301']])
  async readMany(@Query() input: ReadManyDto, @AccountId() accountId: string) {
    const tasks = await this.taskService.getMany({
      accountId: accountId,
      month: input.month,
      year: input.year,
    });

    return {
      count: tasks.length,
      tasks: tasks,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  @RequirePermissions([Permissions['301']])
  async readOne(@Param() input: ReadOneDto, @AccountId() accountId: string) {
    const task = await this.taskService.getOne({
      accountId: accountId,
      id: input.id,
    });

    return {
      task: task,
    };
  }

  @Patch()
  @HttpCode(200)
  @RequirePermissions([Permissions['302']])
  async updateOne(@Body() input: UpdateOneDto, @AccountId() accountId: string) {
    await this.taskService.update({
      id: input.id,
      accountId: accountId,
      name: input.name,
      description: input.description,
      date: input.date,
      category: input.category,
      checked: input.checked,
      finallyDate: input.finallyDate,
      quantityPerWeek: input.quantityPerWeek,
      weekDays: input.weekDays,
      type: input.type,
    });

    return {
      updated: true,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  @RequirePermissions([Permissions['303']])
  async deleteOne(
    @Param() input: DeleteOneDto,
    @AccountId() accountId: string
  ) {
    await this.taskService.excludeOne({
      id: input.id,
      accountId: accountId,
    });

    return {
      deleted: true,
    };
  }
}
