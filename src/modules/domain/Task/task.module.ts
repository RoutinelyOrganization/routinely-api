import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { SessionModule } from '../Session/session.module';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

@Module({
  imports: [SessionModule, PrismaModule],
  providers: [TaskRepository, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
