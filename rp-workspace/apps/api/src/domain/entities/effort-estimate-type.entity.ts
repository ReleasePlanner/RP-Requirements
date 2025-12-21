import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('EffortEstimateType')
export class EffortEstimateType {
  @PrimaryGeneratedColumn()
  effortTypeId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @OneToMany(() => Requirement, (requirement) => requirement.effortType)
  requirements: Requirement[];
}
