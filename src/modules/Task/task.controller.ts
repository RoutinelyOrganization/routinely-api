import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { CreateOneDto, ReadManyDto } from './task.dto';
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
  async readOne() {
    return { message: 'Ler um' };
  }

  @Patch('/:id')
  async updateOne() {
    return { message: 'Editar um' };
  }

  @Delete('/:id')
  async deleteOne() {
    return { message: 'Deletar um' };
  }
}
