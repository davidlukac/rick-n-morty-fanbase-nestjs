import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * EntityType.
 */
@Entity()
export class EntityType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: string;
}
