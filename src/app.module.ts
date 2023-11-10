import { Module } from '@nestjs/common';
import { AccountModule, TaskModule, GoalModule } from './modules';

@Module({
  imports: [AccountModule, TaskModule, GoalModule],
})
export class AppModule {}
