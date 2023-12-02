import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Rick & Morty Fanbase')
    .setDescription('Reviews and ratings for Rick & Morty universe.')
    .setVersion('1.0')
    .addTag('favourite')
    .addTag('review')
    .build();
}
