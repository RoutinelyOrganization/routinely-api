import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

import ValidationPipe from './config/validation-pipe';
import { corsOptionsConfig } from './config/cors';
import { swaggerDocumentConfig } from './config/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  app.use(helmet());
  app.enableCors(corsOptionsConfig);
  app.useGlobalPipes(ValidationPipe);

  const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('', app, document);

  await app.listen(port, () => {
    console.log(`[ONN] Port: ${port}`);
  });
}

bootstrap();
