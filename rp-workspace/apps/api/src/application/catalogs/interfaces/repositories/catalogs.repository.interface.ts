import { Priority } from '../../../../domain/entities/priority.entity';
import { LifecycleStatus } from '../../../../domain/entities/lifecycle-status.entity';
import { RiskLevel } from '../../../../domain/entities/risk-level.entity';
import { Complexity } from '../../../../domain/entities/complexity.entity';
import { EffortEstimateType } from '../../../../domain/entities/effort-estimate-type.entity';
import { RequirementType } from '../../../../domain/entities/requirement-type.entity';
import { VerificationMethod } from '../../../../domain/entities/verification-method.entity';
import { Metric } from '../../../../domain/entities/metric.entity';
import { ProductOwner } from '../../../../domain/entities/product-owner.entity';
import { Approver } from '../../../../domain/entities/approver.entity';
import { Source } from '../../../../domain/entities/source.entity'; // Assuming Source entity path

export interface ICatalogsRepository {
  findAllPriorities(): Promise<Priority[]>;
  createPriority(priority: Partial<Priority>): Promise<Priority>;
  updatePriority(id: number, priority: Partial<Priority>): Promise<Priority>;
  deletePriority(id: number): Promise<void>;

  findAllComplexities(): Promise<Complexity[]>;
  createComplexity(complexity: Partial<Complexity>): Promise<Complexity>;
  updateComplexity(id: number, complexity: Partial<Complexity>): Promise<Complexity>;
  deleteComplexity(id: number): Promise<void>;

  findAllEffortEstimateTypes(): Promise<EffortEstimateType[]>;
  createEffortEstimateType(type: Partial<EffortEstimateType>): Promise<EffortEstimateType>;
  updateEffortEstimateType(
    id: number,
    type: Partial<EffortEstimateType>,
  ): Promise<EffortEstimateType>;
  deleteEffortEstimateType(id: number): Promise<void>;

  findAllRiskLevels(): Promise<RiskLevel[]>;
  createRiskLevel(riskLevel: Partial<RiskLevel>): Promise<RiskLevel>;
  updateRiskLevel(id: number, riskLevel: Partial<RiskLevel>): Promise<RiskLevel>;
  deleteRiskLevel(id: number): Promise<void>;

  findAllSources(): Promise<Source[]>;
  createSource(source: Partial<Source>): Promise<Source>;
  updateSource(id: number, source: Partial<Source>): Promise<Source>;
  deleteSource(id: number): Promise<void>;

  findAllStatuses(): Promise<LifecycleStatus[]>;
  createStatus(status: Partial<LifecycleStatus>): Promise<LifecycleStatus>;
  updateStatus(id: number, status: Partial<LifecycleStatus>): Promise<LifecycleStatus>;
  deleteStatus(id: number): Promise<void>;

  findAllMetrics(): Promise<Metric[]>;
  createMetric(metric: Partial<Metric>): Promise<Metric>;
  updateMetric(id: number, metric: Partial<Metric>): Promise<Metric>;
  deleteMetric(id: number): Promise<void>;

  findAllVerificationMethods(): Promise<VerificationMethod[]>;
  createVerificationMethod(method: Partial<VerificationMethod>): Promise<VerificationMethod>;
  updateVerificationMethod(
    id: number,
    method: Partial<VerificationMethod>,
  ): Promise<VerificationMethod>;
  deleteVerificationMethod(id: number): Promise<void>;

  findAllRequirementTypes(): Promise<RequirementType[]>;
  createRequirementType(type: Partial<RequirementType>): Promise<RequirementType>;
  updateRequirementType(id: number, type: Partial<RequirementType>): Promise<RequirementType>;
  deleteRequirementType(id: number): Promise<void>;

  findAllProductOwners(): Promise<ProductOwner[]>;
  createProductOwner(owner: Partial<ProductOwner>): Promise<ProductOwner>;
  updateProductOwner(id: string, owner: Partial<ProductOwner>): Promise<ProductOwner>;
  deleteProductOwner(id: string): Promise<void>;

  findAllApprovers(): Promise<Approver[]>;
  createApprover(approver: Partial<Approver>): Promise<Approver>;
  updateApprover(id: string, approver: Partial<Approver>): Promise<Approver>;
  deleteApprover(id: string): Promise<void>;
}
