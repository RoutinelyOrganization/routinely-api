import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionModule } from '../Session/session.module';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';

@Module({
  imports: [PrismaModule, SessionModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
})
export class AccountModule {}
