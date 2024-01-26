import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerConfig } from './config/throttler';
import { AccountModule, TaskModule, GoalModule } from './modules';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig),
    AccountModule,
    TaskModule,
    GoalModule,
  ],
})
export class AppModule {}
