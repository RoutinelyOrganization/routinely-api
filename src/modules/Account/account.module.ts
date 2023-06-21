import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionService } from '../Session/session.service';
import { SessionRepository } from '../Session/session.repository';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';

@Module({
  controllers: [AccountController],
  providers: [
    PrismaService,
    SessionService,
    SessionRepository,
    AccountService,
    AccountRepository,
  ],
})
export class AccountModule {}
