import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICatalogsRepository } from '../../../application/catalogs/interfaces/repositories/catalogs.repository.interface';
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
import { Source } from '../../../domain/entities/source.entity';

@Injectable()
export class CatalogsRepository implements ICatalogsRepository {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepo: Repository<Priority>,
    @InjectRepository(LifecycleStatus)
    private readonly statusRepo: Repository<LifecycleStatus>,
    @InjectRepository(RiskLevel)
    private readonly riskLevelRepo: Repository<RiskLevel>,
    @InjectRepository(Complexity)
    private readonly complexityRepo: Repository<Complexity>,
    @InjectRepository(EffortEstimateType)
    private readonly effortTypeRepo: Repository<EffortEstimateType>,
    @InjectRepository(RequirementType)
    private readonly typeRepo: Repository<RequirementType>,
    @InjectRepository(VerificationMethod)
    private readonly verificationRepo: Repository<VerificationMethod>,
    @InjectRepository(Metric)
    private readonly metricRepo: Repository<Metric>,
    @InjectRepository(ProductOwner)
    private readonly productOwnerRepo: Repository<ProductOwner>,
    @InjectRepository(Approver)
    private readonly approverRepo: Repository<Approver>,
    @InjectRepository(Source)
    private readonly sourceRepo: Repository<Source>,
  ) {}

  async findAllPriorities(): Promise<Priority[]> {
    return this.priorityRepo.find();
  }

  async createPriority(priority: Partial<Priority>): Promise<Priority> {
    const newPriority = this.priorityRepo.create(priority);
    return this.priorityRepo.save(newPriority);
  }

  async updatePriority(id: number, priority: Partial<Priority>): Promise<Priority> {
    await this.priorityRepo.update(id, priority);
    return this.priorityRepo.findOneByOrFail({ priorityId: id });
  }

  async deletePriority(id: number): Promise<void> {
    await this.priorityRepo.delete(id);
  }

  async findAllComplexities(): Promise<Complexity[]> {
    return this.complexityRepo.find();
  }

  async createComplexity(complexity: Partial<Complexity>): Promise<Complexity> {
    const newComplexity = this.complexityRepo.create(complexity);
    return this.complexityRepo.save(newComplexity);
  }

  async updateComplexity(id: number, complexity: Partial<Complexity>): Promise<Complexity> {
    await this.complexityRepo.update(id, complexity);
    return this.complexityRepo.findOneByOrFail({ complexityId: id });
  }

  async deleteComplexity(id: number): Promise<void> {
    await this.complexityRepo.delete(id);
  }

  async findAllEffortEstimateTypes(): Promise<EffortEstimateType[]> {
    return this.effortTypeRepo.find();
  }

  async createEffortEstimateType(type: Partial<EffortEstimateType>): Promise<EffortEstimateType> {
    const newType = this.effortTypeRepo.create(type);
    return this.effortTypeRepo.save(newType);
  }

  async updateEffortEstimateType(
    id: number,
    type: Partial<EffortEstimateType>,
  ): Promise<EffortEstimateType> {
    await this.effortTypeRepo.update(id, type);
    return this.effortTypeRepo.findOneByOrFail({ effortTypeId: id });
  }

  async deleteEffortEstimateType(id: number): Promise<void> {
    await this.effortTypeRepo.delete(id);
  }

  async findAllRiskLevels(): Promise<RiskLevel[]> {
    return this.riskLevelRepo.find();
  }

  async createRiskLevel(riskLevel: Partial<RiskLevel>): Promise<RiskLevel> {
    const newRiskLevel = this.riskLevelRepo.create(riskLevel);
    return this.riskLevelRepo.save(newRiskLevel);
  }

  async updateRiskLevel(id: number, riskLevel: Partial<RiskLevel>): Promise<RiskLevel> {
    await this.riskLevelRepo.update(id, riskLevel);
    return this.riskLevelRepo.findOneByOrFail({ riskLevelId: id });
  }

  async deleteRiskLevel(id: number): Promise<void> {
    await this.riskLevelRepo.delete(id);
  }

  async findAllStatuses(): Promise<LifecycleStatus[]> {
    return this.statusRepo.find();
  }

  async createStatus(status: Partial<LifecycleStatus>): Promise<LifecycleStatus> {
    const newStatus = this.statusRepo.create(status);
    return this.statusRepo.save(newStatus);
  }

  async updateStatus(id: number, status: Partial<LifecycleStatus>): Promise<LifecycleStatus> {
    await this.statusRepo.update(id, status);
    return this.statusRepo.findOneByOrFail({ statusId: id });
  }

  async deleteStatus(id: number): Promise<void> {
    await this.statusRepo.delete(id);
  }

  async findAllMetrics(): Promise<Metric[]> {
    return this.metricRepo.find();
  }

  async createMetric(metric: Partial<Metric>): Promise<Metric> {
    const newMetric = this.metricRepo.create(metric);
    return this.metricRepo.save(newMetric);
  }

  async updateMetric(id: number, metric: Partial<Metric>): Promise<Metric> {
    await this.metricRepo.update(id, metric);
    return this.metricRepo.findOneByOrFail({ metricId: id });
  }

  async deleteMetric(id: number): Promise<void> {
    await this.metricRepo.delete(id);
  }

  async findAllVerificationMethods(): Promise<VerificationMethod[]> {
    return this.verificationRepo.find();
  }

  async createVerificationMethod(method: Partial<VerificationMethod>): Promise<VerificationMethod> {
    const newMethod = this.verificationRepo.create(method);
    return this.verificationRepo.save(newMethod);
  }

  async updateVerificationMethod(
    id: number,
    method: Partial<VerificationMethod>,
  ): Promise<VerificationMethod> {
    await this.verificationRepo.update(id, method);
    return this.verificationRepo.findOneByOrFail({ verificationMethodId: id });
  }

  async deleteVerificationMethod(id: number): Promise<void> {
    await this.verificationRepo.delete(id);
  }

  async findAllRequirementTypes(): Promise<RequirementType[]> {
    return this.typeRepo.find();
  }

  async createRequirementType(type: Partial<RequirementType>): Promise<RequirementType> {
    const newType = this.typeRepo.create(type);
    return this.typeRepo.save(newType);
  }

  async updateRequirementType(
    id: number,
    type: Partial<RequirementType>,
  ): Promise<RequirementType> {
    await this.typeRepo.update(id, type);
    return this.typeRepo.findOneByOrFail({ typeId: id });
  }

  async deleteRequirementType(id: number): Promise<void> {
    await this.typeRepo.delete(id);
  }

  async findAllProductOwners(): Promise<ProductOwner[]> {
    return this.productOwnerRepo.find();
  }

  async createProductOwner(owner: Partial<ProductOwner>): Promise<ProductOwner> {
    const newOwner = this.productOwnerRepo.create(owner);
    return this.productOwnerRepo.save(newOwner);
  }

  async updateProductOwner(id: string, owner: Partial<ProductOwner>): Promise<ProductOwner> {
    await this.productOwnerRepo.update(id, owner);
    return this.productOwnerRepo.findOneByOrFail({ productOwnerId: id });
  }

  async deleteProductOwner(id: string): Promise<void> {
    await this.productOwnerRepo.delete(id);
  }

  async findAllApprovers(): Promise<Approver[]> {
    return this.approverRepo.find();
  }

  async createApprover(approver: Partial<Approver>): Promise<Approver> {
    const newApprover = this.approverRepo.create(approver);
    return this.approverRepo.save(newApprover);
  }

  async updateApprover(id: string, approver: Partial<Approver>): Promise<Approver> {
    await this.approverRepo.update(id, approver);
    return this.approverRepo.findOneByOrFail({ approverId: id });
  }

  async deleteApprover(id: string): Promise<void> {
    await this.approverRepo.delete(id);
  }

  async findAllSources(): Promise<Source[]> {
    return this.sourceRepo.find();
  }

  async createSource(source: Partial<Source>): Promise<Source> {
    const newSource = this.sourceRepo.create(source);
    return this.sourceRepo.save(newSource);
  }

  async updateSource(id: number, source: Partial<Source>): Promise<Source> {
    await this.sourceRepo.update(id, source);
    return this.sourceRepo.findOneByOrFail({ sourceId: id });
  }

  async deleteSource(id: number): Promise<void> {
    await this.sourceRepo.delete(id);
  }
}
