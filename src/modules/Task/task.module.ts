import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from '../Session/session.module';

@Module({
  imports: [PrismaModule, SessionModule],
  providers: [TaskService, TaskRepository],
  controllers: [TaskController],
})
export class TaskModule {}
