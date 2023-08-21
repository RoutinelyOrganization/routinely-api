import {
  Controller,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
  Param,
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
    console.log(cred);
    const updatedTask = await this.taskService.updateById(id, {
      ...updateTaskInput,
      accountId: cred.accountId,
    });

    return updatedTask;
  }
}
