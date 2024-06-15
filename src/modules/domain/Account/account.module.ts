import { Module } from '@nestjs/common';

import { PrismaModule } from '@/infra/database/prisma/prisma.module';
import { SessionModule } from '../Session/session.module';
import { MailingModule } from '../Mailing/mailing.module';
import { PasswordTokenModule } from '../PasswordToken/passwordToken.module';

import { AccountController } from './account.controller';

import { AccountService } from './services/account.service';

import { PrismaAccountRepository } from '@/infra/database/prisma/repositories/prisma-account.repository';

@Module({
  imports: [PrismaModule, SessionModule, MailingModule, PasswordTokenModule],
  controllers: [AccountController],
  providers: [AccountService, PrismaAccountRepository],
})
export class AccountModule {}
