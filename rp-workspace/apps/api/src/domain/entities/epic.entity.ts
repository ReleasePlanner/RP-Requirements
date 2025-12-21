import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Initiative } from './initiative.entity';
import { Requirement } from './requirement.entity';
import { LifecycleStatus } from './lifecycle-status.entity';

@Entity('Epic')
export class Epic {
  @PrimaryGeneratedColumn('uuid')
  epicId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  goal: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  businessCaseLink: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  actualCost: number;

  @Column({ type: 'uuid', nullable: true })
  initiativeId: string;

  @ManyToOne(() => Initiative, (initiative) => initiative.epics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'initiativeId' })
  initiative: Initiative;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status_text: string;

  @Column({ type: 'integer', nullable: true })
  statusId: number;

  @ManyToOne(() => LifecycleStatus, (status) => status.epics)
  @JoinColumn({ name: 'statusId' })
  status: LifecycleStatus;

  @OneToMany(() => Requirement, (requirement) => requirement.epic)
  requirements: Requirement[];
}
