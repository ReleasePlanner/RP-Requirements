import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Requirement } from './requirement.entity';

@Entity('RequirementType')
export class RequirementType {
  @PrimaryGeneratedColumn()
  typeId: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status: string;

  @OneToMany(() => Requirement, (requirement) => requirement.type)
  requirements: Requirement[];
}
