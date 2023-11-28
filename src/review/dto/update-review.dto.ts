import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Text of the review.',
    example: 'Lorem ipsum',
  })
  @ApiPropertyOptional()
  text?: string;

  @Min(1)
  @Max(5)
  @IsOptional()
  @ApiProperty({
    description: 'Rating 1-5.',
    example: 2.5,
    minimum: 1,
    maximum: 5,
  })
  @ApiPropertyOptional()
  rating?: number;
}
