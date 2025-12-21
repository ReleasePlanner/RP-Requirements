import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('Priority')
export class Priority {
  @PrimaryGeneratedColumn()
  priorityId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @OneToMany(() => Requirement, (requirement) => requirement.priority)
  requirements: Requirement[];
}
