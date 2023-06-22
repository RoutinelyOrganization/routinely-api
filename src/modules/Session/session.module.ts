import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';

@Module({
  imports: [PrismaModule],
  providers: [SessionRepository, SessionService],
  exports: [SessionService],
})
export class SessionModule {}
