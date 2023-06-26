import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './modules/Account/account.module';
import { PasswordTokenModule } from './modules/PasswordToken/passwordToken.module';

@Module({
  imports: [PrismaModule, AccountModule, PasswordTokenModule],
})
export class AppModule {}
