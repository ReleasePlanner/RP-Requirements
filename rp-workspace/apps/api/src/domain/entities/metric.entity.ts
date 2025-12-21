import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('Metric')
export class Metric {
  @PrimaryGeneratedColumn()
  metricId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  baselineValue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  targetGoal: string;

  @OneToMany(() => Requirement, (requirement) => requirement.metric)
  requirements: Requirement[];
}
