import { Module } from '@nestjs/common';
import { SessionModule } from '../Session/session.module';
import { GoalService } from './goal.service';
import { GoalRepository } from './goal.repository';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { GoalController } from './goal.controller';

@Module({
  imports: [PrismaModule, SessionModule],
  providers: [GoalService, GoalRepository],
  controllers: [GoalController],
})
export class GoalModule {}
