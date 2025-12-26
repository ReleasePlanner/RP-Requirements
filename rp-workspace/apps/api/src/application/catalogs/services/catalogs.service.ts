import { Inject, Injectable } from '@nestjs/common';
import { ICatalogsRepository } from '../interfaces/repositories/catalogs.repository.interface';
import { Priority } from '../../../domain/entities/priority.entity';
import { LifecycleStatus } from '../../../domain/entities/lifecycle-status.entity';
import { RiskLevel } from '../../../domain/entities/risk-level.entity';
import { Complexity } from '../../../domain/entities/complexity.entity';
import { EffortEstimateType } from '../../../domain/entities/effort-estimate-type.entity';
import { RequirementType } from '../../../domain/entities/requirement-type.entity';
import { VerificationMethod } from '../../../domain/entities/verification-method.entity';
import { Metric } from '../../../domain/entities/metric.entity';
import { ProductOwner } from '../../../domain/entities/product-owner.entity';
import { Approver } from '../../../domain/entities/approver.entity';

@Injectable()
export class CatalogsService {
  constructor(
    @Inject('ICatalogsRepository')
    private readonly catalogsRepository: ICatalogsRepository,
  ) {}

  async findAllPriorities(): Promise<Priority[]> {
    return this.catalogsRepository.findAllPriorities();
  }

  async createPriority(priority: Partial<Priority>): Promise<Priority> {
    return this.catalogsRepository.createPriority(priority);
  }

  async updatePriority(id: number, priority: Partial<Priority>): Promise<Priority> {
    return this.catalogsRepository.updatePriority(id, priority);
  }

  async deletePriority(id: number): Promise<void> {
    return this.catalogsRepository.deletePriority(id);
  }

  async findAllStatuses(): Promise<LifecycleStatus[]> {
    return this.catalogsRepository.findAllStatuses();
  }

  async createStatus(status: Partial<LifecycleStatus>): Promise<LifecycleStatus> {
    return this.catalogsRepository.createStatus(status);
  }

  async updateStatus(id: number, status: Partial<LifecycleStatus>): Promise<LifecycleStatus> {
    return this.catalogsRepository.updateStatus(id, status);
  }

  async deleteStatus(id: number): Promise<void> {
    return this.catalogsRepository.deleteStatus(id);
  }

  async findAllRiskLevels(): Promise<RiskLevel[]> {
    return this.catalogsRepository.findAllRiskLevels();
  }

  async createRiskLevel(riskLevel: Partial<RiskLevel>): Promise<RiskLevel> {
    return this.catalogsRepository.createRiskLevel(riskLevel);
  }

  async updateRiskLevel(id: number, riskLevel: Partial<RiskLevel>): Promise<RiskLevel> {
    return this.catalogsRepository.updateRiskLevel(id, riskLevel);
  }

  async deleteRiskLevel(id: number): Promise<void> {
    return this.catalogsRepository.deleteRiskLevel(id);
  }

  async findAllComplexities(): Promise<Complexity[]> {
    return this.catalogsRepository.findAllComplexities();
  }

  async createComplexity(complexity: Partial<Complexity>): Promise<Complexity> {
    return this.catalogsRepository.createComplexity(complexity);
  }

  async updateComplexity(id: number, complexity: Partial<Complexity>): Promise<Complexity> {
    return this.catalogsRepository.updateComplexity(id, complexity);
  }

  async deleteComplexity(id: number): Promise<void> {
    return this.catalogsRepository.deleteComplexity(id);
  }

  async findAllEffortEstimateTypes(): Promise<EffortEstimateType[]> {
    return this.catalogsRepository.findAllEffortEstimateTypes();
  }

  async createEffortEstimateType(type: Partial<EffortEstimateType>): Promise<EffortEstimateType> {
    return this.catalogsRepository.createEffortEstimateType(type);
  }

  async updateEffortEstimateType(
    id: number,
    type: Partial<EffortEstimateType>,
  ): Promise<EffortEstimateType> {
    return this.catalogsRepository.updateEffortEstimateType(id, type);
  }

  async deleteEffortEstimateType(id: number): Promise<void> {
    return this.catalogsRepository.deleteEffortEstimateType(id);
  }

  async findAllRequirementTypes(): Promise<RequirementType[]> {
    return this.catalogsRepository.findAllRequirementTypes();
  }

  async createRequirementType(type: Partial<RequirementType>): Promise<RequirementType> {
    return this.catalogsRepository.createRequirementType(type);
  }

  async updateRequirementType(
    id: number,
    type: Partial<RequirementType>,
  ): Promise<RequirementType> {
    return this.catalogsRepository.updateRequirementType(id, type);
  }

  async deleteRequirementType(id: number): Promise<void> {
    return this.catalogsRepository.deleteRequirementType(id);
  }

  async findAllVerificationMethods(): Promise<VerificationMethod[]> {
    return this.catalogsRepository.findAllVerificationMethods();
  }

  async createVerificationMethod(method: Partial<VerificationMethod>): Promise<VerificationMethod> {
    return this.catalogsRepository.createVerificationMethod(method);
  }

  async updateVerificationMethod(
    id: number,
    method: Partial<VerificationMethod>,
  ): Promise<VerificationMethod> {
    return this.catalogsRepository.updateVerificationMethod(id, method);
  }

  async deleteVerificationMethod(id: number): Promise<void> {
    return this.catalogsRepository.deleteVerificationMethod(id);
  }

  async findAllMetrics(): Promise<Metric[]> {
    return this.catalogsRepository.findAllMetrics();
  }

  async createMetric(metric: Partial<Metric>): Promise<Metric> {
    return this.catalogsRepository.createMetric(metric);
  }

  async updateMetric(id: number, metric: Partial<Metric>): Promise<Metric> {
    return this.catalogsRepository.updateMetric(id, metric);
  }

  async deleteMetric(id: number): Promise<void> {
    return this.catalogsRepository.deleteMetric(id);
  }

  async findAllProductOwners(): Promise<ProductOwner[]> {
    return this.catalogsRepository.findAllProductOwners();
  }

  async createProductOwner(owner: Partial<ProductOwner>): Promise<ProductOwner> {
    return this.catalogsRepository.createProductOwner(owner);
  }

  async updateProductOwner(id: string, owner: Partial<ProductOwner>): Promise<ProductOwner> {
    return this.catalogsRepository.updateProductOwner(id, owner);
  }

  async deleteProductOwner(id: string): Promise<void> {
    return this.catalogsRepository.deleteProductOwner(id);
  }

  async findAllApprovers(): Promise<Approver[]> {
    return this.catalogsRepository.findAllApprovers();
  }

  async createApprover(approver: Partial<Approver>): Promise<Approver> {
    return this.catalogsRepository.createApprover(approver);
  }

  async updateApprover(id: string, approver: Partial<Approver>): Promise<Approver> {
    return this.catalogsRepository.updateApprover(id, approver);
  }

  async deleteApprover(id: string): Promise<void> {
    return this.catalogsRepository.deleteApprover(id);
  }
}
