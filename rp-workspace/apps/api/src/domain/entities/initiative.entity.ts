import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Epic } from './epic.entity';
import { LifecycleStatus } from './lifecycle-status.entity';

@Entity('Initiative')
export class Initiative {
  @PrimaryGeneratedColumn('uuid')
  initiativeId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  strategicGoal: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  estimatedBusinessBenefit: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  estimatedROI: number;

  @Column({ type: 'timestamp', nullable: true })
  dateProposed: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status_text: string;

  @Column({ type: 'uuid', nullable: true })
  portfolioId: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.initiatives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'portfolioId' })
  portfolio: Portfolio;

  @Column({ type: 'integer', nullable: true })
  statusId: number;

  @ManyToOne(() => LifecycleStatus, (status) => status.initiatives)
  @JoinColumn({ name: 'statusId' })
  status: LifecycleStatus;

  @OneToMany(() => Epic, (epic) => epic.initiative)
  epics: Epic[];
}
