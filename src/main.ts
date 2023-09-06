import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Routinely API')
    .setVersion(process.env.npm_package_version)
    .setLicense(
      `${process.env.npm_package_license} license`,
      'https://github.com/RoutinelyOrganization/routinely-api/blob/develop/LICENSE'
    )
    .addBearerAuth({
      type: 'http',
      description: 'Get the `token` property after logging in',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT, () => {
    console.log(`[ONN] Port: ${process.env.PORT}`);
  });
}
bootstrap();
