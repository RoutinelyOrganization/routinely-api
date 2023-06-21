import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule, SessionModule } from './modules';

@Module({
  imports: [PrismaModule, AccountModule, SessionModule],
})
export class AppModule {}
