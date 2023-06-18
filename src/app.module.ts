import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './modules/Account/account.module';

@Module({
  imports: [PrismaModule, AccountModule],
})
export class AppModule {}
