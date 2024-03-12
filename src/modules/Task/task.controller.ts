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
import { ApiTags } from '@nestjs/swagger';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import {
  CreateOneDto,
  ReadManyDto,
  ReadOneDto,
  UpdateOneDto,
} from './task.dto';
import { AccountId } from 'src/utils/decorators/accountid.decorator';
import { TaskService } from './task.service';

@ApiTags('Tarefas')
@UseGuards(RolesGuard)
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
      tag: input.tag,
      priority: input.priority,
      category: input.category,
      accountId: accountId,
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
      priority: input.priority,
      category: input.category,
      tag: input.tag,
      checked: input.checked,
    });

    return {
      updated: true,
    };
  }

  @Delete('/:id')
  async deleteOne() {
    return { message: 'Deletar um' };
  }
}
