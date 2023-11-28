import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Make sure to strip elements from input that are not defined in DTOs to improve security.
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Rick & Morty Fanbase')
    .setDescription('Reviews and ratings for Rick & Morty universe.')
    .setVersion('1.0')
    .addTag('favourite')
    .addTag('review')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
