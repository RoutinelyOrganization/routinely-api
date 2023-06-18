import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';

@Module({
  controllers: [AccountController],
  providers: [PrismaService, AccountService, AccountRepository],
})
export class AccountModule {}
