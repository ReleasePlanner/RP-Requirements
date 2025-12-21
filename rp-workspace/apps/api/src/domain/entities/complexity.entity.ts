import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('Complexity')
export class Complexity {
  @PrimaryGeneratedColumn()
  complexityId: number;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @OneToMany(() => Requirement, (requirement) => requirement.complexity)
  requirements: Requirement[];
}
