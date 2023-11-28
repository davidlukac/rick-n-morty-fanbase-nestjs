import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * User.
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;
}
