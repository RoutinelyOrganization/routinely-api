import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { CreateOneDto } from './task.dto';
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
      ...input,
      accountId: accountId,
    });

    return {
      message: 'Tarefa criada com sucesso!',
    };
  }

  @Get()
  async readMany() {
    return { message: 'Ler muitos' };
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
