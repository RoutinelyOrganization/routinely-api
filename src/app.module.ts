import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountModule, TaskModule, GoalModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AccountModule,
    TaskModule,
    GoalModule,
  ],
})
export class AppModule {}
