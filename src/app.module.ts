import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule, SessionModule } from './modules';
import { PasswordTokenModule } from './modules/PasswordToken/passwordToken.module';
@Module({
  imports: [PrismaModule, AccountModule, SessionModule, PasswordTokenModule],
})
export class AppModule {}
