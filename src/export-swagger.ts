import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import { createSwaggerConfig } from './swagger-config';

async function exportSwagger() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const document = SwaggerModule.createDocument(app, createSwaggerConfig());

  const artifactsDir = 'artifacts';
  fs.mkdirSync(artifactsDir, { recursive: true });
  fs.writeFileSync(path.join(artifactsDir, 'swagger.json'), JSON.stringify(document, null, 2));
  console.log('Swagger JSON exported successfully');

  await app.close();
}

exportSwagger();
