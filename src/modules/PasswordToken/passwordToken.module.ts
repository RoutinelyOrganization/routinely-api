import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PasswordTokenRepository } from './passwordToken.repository';
import { PasswordTokenService } from './passwordToken.service';

@Module({
  providers: [PasswordTokenService, PrismaService, PasswordTokenRepository],
})
export class PasswordTokenModule {}
