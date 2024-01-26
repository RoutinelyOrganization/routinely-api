import {
  Controller,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  Param,
  ForbiddenException,
  Delete,
  HttpCode,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateTaskInput,
  FindATaskControllerDto,
  FindTasksControllerDto,
  UpdateTaskInput,
} from './task.dtos';
import { CREDENTIALS_KEY } from 'src/utils/constants';
import { RequirePermissions, Permissions, RolesGuard } from 'src/guards';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Post()
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['301']])
  async create(@Body() createTaskInput: CreateTaskInput, @Req() req: Request) {
    const cred = req[CREDENTIALS_KEY];

    const createdTask = await this.taskService.create({
      ...createTaskInput,
      accountId: cred.accountId,
    });
    return createdTask;
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['302']])
  async updateById(
    @Param('id') id: number,
    @Body() updateTaskInput: UpdateTaskInput,
    @Req() req: Request
  ) {
    const cred = req[CREDENTIALS_KEY];

    const accountId = await this.taskService.getAccountById(id);

    // Authorization
    if (accountId != cred.accountId) throw new ForbiddenException();

    const updatedTask = await this.taskService.updateById(id, {
      ...updateTaskInput,
      accountId: cred.accountId,
    });

    return updatedTask;
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['303']])
  @HttpCode(200)
  async deleteById(@Param('id') id: number, @Req() req: Request) {
    const cred = req[CREDENTIALS_KEY];

    const accountId = await this.taskService.getAccountById(id);

    // Authorization
    if (accountId != cred.accountId) throw new ForbiddenException();

    await this.taskService.deleteById(id);
    return;
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['301']])
  async accountTasks(
    @Query() input: FindTasksControllerDto,
    @Req() request: Request
  ) {
    const { accountId } = request[CREDENTIALS_KEY];

    return await this.taskService.findAccountTasks({
      month: input.month,
      year: input.year,
      accountId,
    });
  }

  @ApiTags('Tasks')
  @ApiBearerAuth()
  @Get('/:taskId')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['301']])
  async getATaskInfo(
    @Param() input: FindATaskControllerDto,
    @Req() request: Request
  ) {
    const { accountId } = request[CREDENTIALS_KEY];

    return await this.taskService.findTaskByid({
      taskId: input.taskId,
      accountId,
    });
  }
}
