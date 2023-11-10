import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import ValidationPipe from './config/validation-pipe';
import { corsOptionsConfig } from './config/cors';
import { swaggerDocumentConfig } from './config/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors(corsOptionsConfig);
  app.useGlobalPipes(ValidationPipe);

  const document = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT, () => {
    console.log(`[ONN] Port: ${process.env.PORT}`);
  });
}

bootstrap();
