import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CheckFavouriteDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of favourited entity (location, character, episode, ...).',
    example: 1,
  })
  entityId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of entity type (location, character, episode).',
    example: 1,
  })
  entityTypeId: number;
}
