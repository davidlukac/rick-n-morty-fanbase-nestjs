import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of episode.',
    example: 1,
  })
  episodeId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Text of the review.',
    example: 'Lorem ipsum',
  })
  text: string;

  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @ApiProperty({
    description: 'Rating 1-5.',
    example: 2.5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;
}
