import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule, SessionModule } from './modules';
import { PasswordTokenModule } from './modules/PasswordToken/passwordToken.module';
import { MailingModule } from './modules/Mailing/mailing.module';
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
