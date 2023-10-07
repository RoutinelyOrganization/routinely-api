import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateGoalInput } from './goal.dto';
import { GoalService } from './goal.service';
import { Permissions, RequirePermissions, RolesGuard } from 'src/guards';
import { Request } from 'express';
import { CREDENTIALS_KEY } from 'src/utils/constants';
import { ApiTags } from '@nestjs/swagger';

@Controller('goals')
export class GoalController {
  constructor(private goalService: GoalService) {}

  @ApiTags('Goals')
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
}
