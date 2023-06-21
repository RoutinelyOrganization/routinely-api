import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  providers: [PrismaService, SessionRepository, SessionService],
})
export class SessionModule {}
