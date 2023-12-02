import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { createSwaggerConfig } from './swagger-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Make sure to strip elements from input that are not defined in DTOs to improve security.
    }),
  );

  const document = SwaggerModule.createDocument(app, createSwaggerConfig());
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
