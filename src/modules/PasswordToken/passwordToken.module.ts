import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordTokenRepository } from './passwordToken.repository';
import { PasswordTokenService } from './passwordToken.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PasswordTokenService, PasswordTokenRepository],
  exports: [PasswordTokenService],
})
export class PasswordTokenModule {}
