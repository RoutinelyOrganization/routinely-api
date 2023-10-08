import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGoalInput, UpdateGoalInput } from './goal.dto';
import { GoalService } from './goal.service';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { Request } from 'express';
import { CREDENTIALS_KEY } from 'src/utils/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('goals')
export class GoalController {
  constructor(private goalService: GoalService) {}

  @ApiTags('Goals')
  @ApiBearerAuth()
  @Post()
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['400']])
  async create(@Body() createGoalInput: CreateGoalInput, @Req() req: Request) {
    const cred = req[CREDENTIALS_KEY];

    const createdGoal = await this.goalService.create({
      ...createGoalInput,
      accountId: cred.accountId,
    });

    return createdGoal;
  }

  @ApiTags('Goals')
  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['402']])
  async updateById(
    @Param('id') id: string,
    @Body() updateGoalInput: UpdateGoalInput,
    @Req() req: Request
  ) {
    const cred = req[CREDENTIALS_KEY];

    const accountId = await this.goalService.getAccountById(id);
    if (accountId != cred.accountId) throw new ForbiddenException();

    const updatedGoal = await this.goalService.updateById(id, {
      ...updateGoalInput,
      accountId: cred.accountId,
    });

    return updatedGoal;
  }

  @ApiTags('Goals')
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(RolesGuard)
  @RequirePermissions([Permissions['403']])
  async deleteById(@Param('id') id: string, @Req() req: Request) {
    const cred = req[CREDENTIALS_KEY];

    const accountId = await this.goalService.getAccountById(id);
    if (accountId != cred.accountId) throw new ForbiddenException();

    await this.goalService.deleteById(id);
    return;
  }
}
