import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import {
  AccountModule,
  SessionModule,
  PasswordTokenModule,
  MailingModule,
} from './modules';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    SessionModule,
    PasswordTokenModule,
    MailingModule,
  ],
})
export class AppModule {}
