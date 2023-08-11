import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import {
  AccountModule,
  SessionModule,
  PasswordTokenModule,
  MailingModule,
} from './modules';
import { CONFIGURE_MODULE } from './config';

@Module({
  imports: [
    ConfigModule.forRoot(CONFIGURE_MODULE),
    PrismaModule,
    AccountModule,
    SessionModule,
    PasswordTokenModule,
    MailingModule,
  ],
})
export class AppModule {}
