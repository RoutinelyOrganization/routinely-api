import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import {
  AccountModule,
  SessionModule,
  PasswordTokenModule,
  MailingModule,
  TaskModule,
} from './modules';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    SessionModule,
    PasswordTokenModule,
    MailingModule,
    TaskModule,
  ],
})
export class AppModule {}
