import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Epic } from './epic.entity';
import { Priority } from './priority.entity';
import { LifecycleStatus } from './lifecycle-status.entity';
import { RequirementType } from './requirement-type.entity';
import { Complexity } from './complexity.entity';
import { Source } from './source.entity';
import { EffortEstimateType } from './effort-estimate-type.entity';
import { RiskLevel } from './risk-level.entity';
import { Metric } from './metric.entity';
import { VerificationMethod } from './verification-method.entity';
import { ProductOwner } from './product-owner.entity';
import { Approver } from './approver.entity';
import { RequirementReference } from './requirement-reference.entity';

@Entity('Requirement')
export class Requirement {
  @PrimaryGeneratedColumn('uuid')
  requirementId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  storyStatement: string;

  @Column({ type: 'text', nullable: true })
  acceptanceCriteria: string;

  @Column({ type: 'integer', nullable: true })
  effortEstimate: number;

  @Column({ type: 'integer', nullable: true })
  actualEffort: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  businessValue: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  changeHistoryLink: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ownerRole: string; // e.g. "Senior Analyst"

  @Column({ type: 'varchar', length: 100, nullable: true })
  applicablePhase: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  requirementVersion: string;

  @Column({ type: 'timestamp', nullable: true })
  requirementStatusDate: Date;

  @Column({ type: 'boolean', default: false })
  isMandatory: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  status_text: string;

  @CreateDateColumn()
  creationDate: Date;

  @Column({ type: 'date', nullable: true })
  goLiveDate: Date;

  // --- Belcorp Prioritization Matrix ---
  @Column({ type: 'integer', nullable: true })
  estimatedIncrementalSales: number;

  @Column({ type: 'integer', nullable: true })
  experienceImpactScore: number;

  @Column({ type: 'integer', nullable: true })
  competitiveBenchmarkScore: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  valueEffortRatio: number;

  @Column({ type: 'integer', nullable: true })
  campaignUrgencyScore: number;

  // --- Discovery & Execution Controls ---
  @Column({ type: 'boolean', default: false })
  needsFunctionalDiscovery: boolean;

  @Column({ type: 'boolean', default: false })
  needsExperimentation: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  externalReferenceLink: string;

  @Column({ type: 'text', nullable: true })
  teamDependencies: string;

  // Foreign Keys (Catalogs)
  @Column({ type: 'integer', nullable: true })
  priorityId: number;

  @Column({ type: 'integer', nullable: true })
  statusId: number;

  @Column({ type: 'integer', nullable: true })
  typeId: number;

  @Column({ type: 'integer', nullable: true })
  complexityId: number;

  @Column({ type: 'integer', nullable: true })
  sourceId: number;

  @Column({ type: 'integer', nullable: true })
  effortTypeId: number;

  @Column({ type: 'integer', nullable: true })
  riskLevelId: number;

  @Column({ type: 'integer', nullable: true })
  metricId: number;

  @Column({ type: 'integer', nullable: true })
  verificationMethodId: number;

  // Foreign Keys (Hierarchy & Users)
  @Column({ type: 'uuid', nullable: true })
  epicId: string;

  @Column({ type: 'uuid', nullable: true })
  productOwnerId: string;

  @Column({ type: 'uuid', nullable: true })
  approverId: string;

  // Relations
  @ManyToOne(() => Priority, (priority) => priority.requirements)
  @JoinColumn({ name: 'priorityId' })
  priority: Priority;

  @ManyToOne(() => LifecycleStatus, (status) => status.requirements)
  @JoinColumn({ name: 'statusId' })
  status: LifecycleStatus;

  @ManyToOne(() => RequirementType, (type) => type.requirements)
  @JoinColumn({ name: 'typeId' })
  type: RequirementType;

  @ManyToOne(() => Complexity, (complexity) => complexity.requirements)
  @JoinColumn({ name: 'complexityId' })
  complexity: Complexity;

  @ManyToOne(() => Source, (source) => source.requirements)
  @JoinColumn({ name: 'sourceId' })
  source: Source;

  @ManyToOne(() => EffortEstimateType, (type) => type.requirements)
  @JoinColumn({ name: 'effortTypeId' })
  effortType: EffortEstimateType;

  @ManyToOne(() => RiskLevel, (riskLevel) => riskLevel.requirements)
  @JoinColumn({ name: 'riskLevelId' })
  riskLevel: RiskLevel;

  @ManyToOne(() => Metric, (metric) => metric.requirements)
  @JoinColumn({ name: 'metricId' })
  metric: Metric;

  @ManyToOne(() => VerificationMethod, (vm) => vm.requirements)
  @JoinColumn({ name: 'verificationMethodId' })
  verificationMethod: VerificationMethod;

  @ManyToOne(() => Epic, (epic) => epic.requirements, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'epicId' })
  epic: Epic;

  @ManyToOne(() => ProductOwner)
  @JoinColumn({ name: 'productOwnerId' })
  productOwner: ProductOwner;

  @ManyToOne(() => Approver)
  @JoinColumn({ name: 'approverId' })
  approver: Approver;

  @OneToMany(() => RequirementReference, (reference) => reference.requirement)
  references: RequirementReference[];
}
