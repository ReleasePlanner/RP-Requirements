import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('RiskLevel')
export class RiskLevel {
  @PrimaryGeneratedColumn()
  riskLevelId: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  riskType: string;

  @OneToMany(() => Requirement, (requirement) => requirement.riskLevel)
  requirements: Requirement[];
}
