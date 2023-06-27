import {
  Injectable,
  INestApplication,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private async insertsNewFunctionToDeleteExpiredSessions() {
    try {
      await this.$queryRaw`
        CREATE OR REPLACE FUNCTION delete_expired_sessions() RETURNS TRIGGER AS
        $del_exp_ses$
          BEGIN
            DELETE FROM sessions
            WHERE refresh_expires_in < now();
          RETURN NULL;
          END;
        $del_exp_ses$ LANGUAGE plpgsql;
      `;
    } catch (error) {
      throw new InternalServerErrorException(`
        Error when trying to create function to delete expired sessions
        ${error}
      `);
    }
  }

  private async activateTheTriggerAfterUpdatingAnySessionData() {
    try {
      await this.$queryRaw`
        CREATE OR REPLACE TRIGGER del_exp_ses
        AFTER UPDATE ON sessions
        FOR EACH STATEMENT
        EXECUTE PROCEDURE delete_expired_sessions();
      `;
    } catch (error) {
      throw new InternalServerErrorException(`
        Error when trying create trigger to delete expired sessions
        ${error}
      `);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  async onModuleInit() {
    await this.insertsNewFunctionToDeleteExpiredSessions();
    await this.activateTheTriggerAfterUpdatingAnySessionData();
  }
}
