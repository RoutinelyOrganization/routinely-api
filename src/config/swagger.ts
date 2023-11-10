import { DocumentBuilder } from '@nestjs/swagger';
import { APP_LICENSE, APP_NAME, APP_VERSION } from './constants';

export const swaggerDocumentConfig = new DocumentBuilder()
  .setTitle(APP_NAME)
  .setVersion(APP_VERSION)
  .setLicense(
    `${APP_LICENSE} license`,
    'https://github.com/RoutinelyOrganization/routinely-api/blob/develop/LICENSE'
  )
  .addBearerAuth({
    type: 'http',
    description: 'Use o `token` adquirido ao acessar a conta',
  })
  .build();
