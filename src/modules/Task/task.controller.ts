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
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskInput, UpdateTaskInput } from './task.dtos';
import { CREDENTIALS_KEY } from 'src/config';
import { RequirePermissions, Permissions, RolesGuard } from 'src/guards';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

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

  @Put(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['302']])
  async updateById(
    @Param('id') id: string,
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

  @Delete(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['303']])
  @HttpCode(200)
  async deleteById(@Param('id') id: string, @Req() req: Request) {
    const cred = req[CREDENTIALS_KEY];

    const accountId = await this.taskService.getAccountById(id);

    // Authorization
    if (accountId != cred.accountId) throw new ForbiddenException();

    await this.taskService.deleteById(id);
    return;
  }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['301']])
  async accountTasks(
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
    @Req() request: Request
  ) {
    const { accountId } = request[CREDENTIALS_KEY];

    return await this.taskService.findAccountTasks({
      month,
      year,
      accountId,
    });
  }
}
