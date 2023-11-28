import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Review.
 */
@Entity()
@Unique(['userId', 'episodeId'])
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID if a Review.', example: 1 })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  @ApiProperty({ description: 'User ID.', example: 1 })
  userId: number;

  @Column({ nullable: false })
  @ApiProperty({ description: 'Episode ID.', example: 1 })
  episodeId: number;

  @Column({ nullable: false })
  @ApiProperty({
    description: 'Text of the review.',
    example: 'Lorem ipsum',
  })
  text: string;

  @Column('decimal', { precision: 2, scale: 1, nullable: false })
  @ApiProperty({
    description: 'Rating 1-5.',
    example: 2.5,
    minimum: 1,
    maximum: 5,
  })
  rating: number;
}
