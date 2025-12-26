import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('VerificationMethod')
export class VerificationMethod {
  @PrimaryGeneratedColumn()
  verificationMethodId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // Inspection, Demonstration, Test, Analysis

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @OneToMany(() => Requirement, (requirement) => requirement.verificationMethod)
  requirements: Requirement[];
}
