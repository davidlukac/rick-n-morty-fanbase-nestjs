import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { EntityType } from './entity-type.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Favourite.
 *
 * Sets database constrains for unique combination of `entityID` and `entityTypeID` for any given user.
 */
@Entity()
@Unique(['entityId', 'userId', 'entityTypeId'])
export class Favourite {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID if a Favourite.', example: 1 })
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  @ApiProperty({ description: 'User ID.', example: 1 })
  userId: number;

  @Column({ nullable: false })
  @ApiProperty({ description: 'ID of favourited entity.', example: 1 })
  entityId: number;

  @ManyToOne(() => EntityType, { nullable: false })
  @JoinColumn({ name: 'entityTypeId' })
  entityType: EntityType;

  @Column({ nullable: false })
  @ApiProperty({ description: 'ID of favourited entity type.', example: 1 })
  entityTypeId: number;
}
